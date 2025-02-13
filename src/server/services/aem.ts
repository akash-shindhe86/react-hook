import api from '@/server/services/api';
import envConfig from '@/server/config';
import {AEMType, AppVersionType} from '@/server/services/types';
import { checkIsHTMLContent, replaceBanner } from '@/server/services/utils';
import CONSTANTS from '@/constants';
import {headers} from 'next/headers';
import logger from '@/logger/logger';

const AEM: AEMType = {
    banner: ''
};

function resolveBanner(hostname: string) :string {
    if (hostname !== "localhost") {
        for (let i = 0; i < CONSTANTS.BANNERS.length; i++) {
            const regex = new RegExp(CONSTANTS.BANNERS[i]);
            if (regex.test(hostname)) {
                return CONSTANTS.BANNERS[i];
            }
        }
    }
    return "safeway";
}

/**
 * Gets the host from the request headers.
 * check if x-forwarded-host is present, if not then use host header
 * @returns {string}   The current request host.
 */
function getHost() {
    const currentDomain = headers().get('x-forwarded-host');
    const host = headers().get('host');
    let finalDomain: string;
    if(!currentDomain){
       finalDomain = host ? host : '';
    } else {
        finalDomain = currentDomain;
    }
    logger.debug("getHost(): Resolved Domain: " + finalDomain);
    return finalDomain;
}

function getBanner(): string {
    let banner: string;
    const domain = getHost();
    if(domain === null){
        logger.error("getBanner():Missing x-forwarded-host header from upstream, Will be resolved to default banner");
        return '';
    }
    banner = resolveBanner(domain);
    logger.debug("getBanner(): Resolved Banner: " + AEM.banner);
    return banner;
}

function getRequestHeaders(): string {
    return JSON.stringify(headers());
}

/**
 * Checks if site is a B2B site.
 * 
 * @returns {boolean}   Returns true if the site is B2B site.
 */
function isB2BSite(): boolean {
    return getHost().startsWith("business");
}

function getConfig() {
    const isBusinessBanner: boolean = isB2BSite();
    const env = getEnvFromHost();
    // @ts-ignore
    return isBusinessBanner ? envConfig["B2B"][env] : envConfig["B2C"][env];
}

/**
 * Method to determine environment using the host
 * returns the environment and default to prod
 * **/
const getEnvFromHost = (isAppEnv = false): string => {
    const currentDomain = getHost()
    let env: string;
    if(currentDomain.includes('dev') || currentDomain.includes('www-dev2') || currentDomain.includes('business-dev') || currentDomain.includes('business-dev2')){
        env = 'dev';
    } else if(currentDomain.includes('www-qa1') || currentDomain.includes('business-qa1') || currentDomain.includes('localhost') || currentDomain.includes('local-origin')){
        env = isAppEnv ? 'qa1' : 'qa';
    } else if(currentDomain.includes('www-qa2') || currentDomain.includes('business-qa2')){
        env = isAppEnv ? 'qa2' : 'acceptance';
    } else if(currentDomain.includes('www-qa3') || currentDomain.includes('business-qa3')){
        env = isAppEnv ? 'qa3' : 'perf';
    } else if(currentDomain.includes('www-stage') || currentDomain.includes('business-stage')){
        env = 'stage'
    } else if(currentDomain.includes('www-beta') || currentDomain.includes('business-beta')){
        env = 'beta'
    } else {
        env = 'prod'
    }
    logger.debug("getEnvFromHost(): Resolved Environment:" + env);
    return env;
}

function getAEM(): AEMType {
    AEM['banner'] = getBanner();
    logger.debug("getAEM(): Resolved Banner: " + AEM.banner);
    AEM['config'] = getConfig();
    return AEM;
}

// function to get checksum version for header and footer
async function getCheckSum(banner: string, checkSumUrl: string) {
    try {
        logger.debug("getCheckSum: ", checkSumUrl);
        return await api(replaceBanner(checkSumUrl, banner), { cache: 'no-cache' });
    }
    catch (e) {
        logger.error("getCheckSum: AEM dependency failed or parse error", e);
        return {
            header: '',
            footer: '',
        };
    }
}

// function to get Header HTML
async function getHeaderHTML(aemHeaderUrl: string, version: string, banner: string) {
    try {
        let response = await api(replaceBanner(aemHeaderUrl + "?version=" + version, banner), { cache: 'force-cache' }, CONSTANTS.RESPONSE_TYPE_TEXT);
        if(checkIsHTMLContent(response)) {
            logger.debug("getHeaderHTML(): rendering HTML");
            return response;
        }
        logger.info("getHeaderHTML(): Invalid HTML content");
        return '';
    }
    catch (e) {
        logger.error("getHeaderHTML(): Failed to fetch AEM Header HTML");
        return '';
    }
}

// function to get Header rendered HTML
const getHeaderRender = async (version: string): Promise<any> =>{
    const config = getAEM().config!;
    const banner: string = getAEM().banner!;
    const url = headers().get('url') || ""
    let headerUrl: string;
    if(url.includes("vineandcellar")){
        headerUrl = config?.aemVineHeaderUrl
    } else if(url.includes("marketplace")){
        headerUrl = config?.aemMarketPlaceHeaderUrl
    } else{
        headerUrl = config?.aemHeaderUrl
    }
    const baseDomainUrl = config?.baseDomainUrl.includes('www-stage') ? config?.baseDomainUrl.replace('www-stage', 'www') : config?.baseDomainUrl.includes('business-stage') ? config?.baseDomainUrl.replace('business-stage', 'business') : config?.baseDomainUrl;
    logger.debug("getHeaderRender(): AEM Checksum received");
    return await getHeaderHTML(baseDomainUrl+headerUrl, version, banner);
}

// function to get Footer HTML
async function getFooterHTML(aemFooterUrl: string, version: string, banner: string) {
    try {
        let response = await api(replaceBanner(aemFooterUrl + "?version=" + version, banner), { cache: 'force-cache' }, CONSTANTS.RESPONSE_TYPE_TEXT);
        if(checkIsHTMLContent(response)) {
            logger.debug("getFooterHTML(): Rendering Footer HTML");
            return response;
        }
        logger.info("getFooterHTML(): Invalid HTML content");
        return '';
    }
    catch (e) {
        logger.error("getFooterHTML(): Failed to fetch AEM Header HTML");
        return '';
    }
}

// function to get Footer rendered HTML
const getFooterRender = async (version: string): Promise<any> =>{

    const config = getAEM().config!;
    const banner: string = getAEM().banner!;
    const url = headers().get('url') || ""
    let footerUrl: string;
    if(url.includes("vineandcellar")){
        footerUrl = config?.aemVineFooterUrl;
    } else if(url.includes("marketplace")){
        footerUrl = config?.aemMarketPlaceFooterUrl;
    } else{
        footerUrl = config?.aemFooterUrl;
    }
    const baseDomainUrl = config?.baseDomainUrl.includes('www-stage') ? config?.baseDomainUrl.replace('www-stage', 'www') : config?.baseDomainUrl.includes('business-stage') ? config?.baseDomainUrl.replace('business-stage', 'business') : config?.baseDomainUrl;
    logger.debug("getFooterRender(): " + version);
    return await getFooterHTML(baseDomainUrl+footerUrl, version, banner);
}


// API call to get all on load events needed to render Header
const getOnLoadEvents = async (url: string, version: string): Promise<any> => {
    try {
        let response = await api(url + "?version=" + version, { cache: 'force-cache' }, CONSTANTS.RESPONSE_TYPE_TEXT);
        // making sure that response should contain HTML tag
        if(checkIsHTMLContent(response)) {
            logger.debug("getOnLoadEvents(): Rendering AEM onload event");
            return response;
        }
        logger.info("getOnLoadEvents(): Invalid HTML content");
        return '';
    }
    catch (e) {
        logger.error("getOnLoadEvents(): Failed to fetch AEM Header HTML");
        return '';
    }
};

const getAEMDisclaimer = async (): Promise<any> => {
    const config = getAEM().config!;
    const banner: string = getAEM().banner!;

    try {
        const baseDomainUrl = config?.baseDomainUrl.includes('www-stage') ? config?.baseDomainUrl.replace('www-stage', 'www') : config?.baseDomainUrl.includes('business-stage') ? config?.baseDomainUrl.replace('business-stage', 'business') : config?.baseDomainUrl;
        let response = await api(replaceBanner(baseDomainUrl+config.aemDisclaimerUrl, banner), {}, CONSTANTS.RESPONSE_TYPE_TEXT);
        if(checkIsHTMLContent(response)) {
            logger.debug("getAEMDisclaimer(): Rendering AEM Disclaimer");
            return response;
        }
        logger.info("getAEMDisclaimer(): Invalid HTML content");
        return '';
    }
    catch (e) {
        logger.error("getAEMDisclaimer(): Failed to fetch AEM Header HTML",);
        return '';
    }

};

export default {
    getAEM,
    getHeaderRender,
    getOnLoadEvents,
    getFooterRender,
    getAEMDisclaimer,
    getRequestHeaders,
    getCheckSum,
    getEnvFromHost
}
