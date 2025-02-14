'use client';

import React, { useEffect } from 'react';
import Cookies from "js-cookie";
import { Items, EnhanceContentProps } from './types';
import withLazyLoad from '../lazy-load/withLazyLoad';
import logger from '@/logger/logger';
import './signifyd.min';

export const items: Items = {
    contentContainerSelector: '.enhanced-content',
    contentDetailSelector: '.enhanced-content__container',
    dNoneClass: 'd-none',
    salsifyContentElemSelector: '#syndi_inline',
};

function loadSyndigoScript() {
    // syndigo SDK script
    (function (s: any, y: string, n: string, di: any = null, go: any = null) {
        di = s.createElement(y);
        di.type = 'text/java' + y;
        di.async = true;
        di.src = n + Math.floor(Date.now() / 86400000);
        di.setAttribute('data-testid', "syndigo-script");
        go = s.getElementsByTagName(y)[0];
        go?.parentNode.insertBefore(di, go);
    })(document, 'script', 'https://content.syndigo.com/site/d13ed206-6318-4e14-9097-1b30066e995f/tag.js?cv=');
}

function loadSalsifyScript() {
    // salsify SDK script
    (function (d: Document, y: string, src: string, script: any = null): void {
        script = d.createElement(y);
        script.type = 'text/java' + y;
        script.async = true;
        script.defer = true;
        script.src = src;
        script.setAttribute('data-testid', "salsify-script");
        const first: any = d.getElementsByTagName(y)[0];
        first?.parentNode.insertBefore(script, first);
    })(document,'script', 'https://salsify-ecdn.com/sdk/latest/salsify.js');
}

export const loadEnhancedContentFromSyndigo = (fallback: () => void, showEnhancedContent: () => void, bpn: string, loadSyndigoScript: () => void): void => {
    window.SYNDI = window.SYNDI || [];
    loadSyndigoScript(); // load syndigo SDK script
    window.SYNDI.push({
        contentCallback: function (hasContent: boolean) {
            if (hasContent) {
                showEnhancedContent();
            } else {
                fallback();
            }
        },
    });

    window.SYNDI.push(bpn);
}

export const loadEnhancedContentFromSalsify = (enableUserTracking: boolean = true, config: any, bpn: string, loadSalsifyScript: () => void): void => {
    loadSalsifyScript(); // load salsify SDK script
    window.salsifyExperiencesSdkLoaded = async function (salsify: any) {
        salsify.init({
            clientId: config.salsifyClientId,
            enhancedContent: { idType: config.salsifyContentIdType },
            tracking: enableUserTracking,
        });

        const exists = await salsify.enhancedContent.exists(bpn);
        if (exists) {
            logger.debug("loadEnhancedContentFromSalsify(): Salsify returned data Showing enhance content.");
            salsify.enhancedContent.renderIframe(document.querySelector(items.salsifyContentElemSelector), bpn);
            showEnhancedContent();
        } else {
            logger.info("loadEnhancedContentFromSalsify(): No data returned from Salsify. Hiding enhance content");
        }
    };
}

export const showEnhancedContent = (): void => {
    const contentBlock = document.querySelector(items.contentContainerSelector);
    const contentDetailBlock = document.querySelector(items.contentDetailSelector);

    if (contentBlock !== null) {
        contentBlock.classList.remove(items.dNoneClass);
    }
    if (contentDetailBlock !== null) {
        contentDetailBlock.setAttribute('aria-hidden', 'false');
    }
};

const EnhanceContent: React.FC<EnhanceContentProps> = ({ config, bpn }): React.ReactElement => {

    /**
     * If syndigo SDK return go with Syndigo (it has priority over Salsify).
     * Otherwise, go with Salsify.
     * Do nothing if both will not return data.
     */
    const loadEnhancedContent = (enableUserTracking: boolean = true): void => {
        loadEnhancedContentFromSyndigo(() => {
            logger.debug("loadEnhancedContent(): No data returned from Syndigo. Trying Salsify.");
            loadEnhancedContentFromSalsify(enableUserTracking, config, bpn, loadSalsifyScript);
        }, showEnhancedContent, bpn, loadSyndigoScript);
    };

    function checkEventAndLoadContent(event: string) {
        if (event && event.indexOf('C0003') !== -1) {
            logger.debug("checkEventAndLoadContent(): C003 is part of active groups. Loading enhance content.");
            loadEnhancedContent();
        } else {
            logger.debug("checkEventAndLoadContent(): C003 is not part of active groups, loading enhance content tracking cookies and load content");
            loadEnhancedContent(false);
            removeEnhanceContentCookies();
        }
    }

    function oneTrustLoadedEventHandler(eventResponse: any) {
        logger.debug("oneTrustLoadedEventHandler(): OneTrustGroupsUpdated event received");
        const oneTrustLoadedEventResponse = eventResponse && eventResponse.detail;
        checkEventAndLoadContent(oneTrustLoadedEventResponse);
    }
    /**
     * function to check user functional cookie consent
     * check if OneTrustLoaded Event available in data layer and C0003 is part of active groups
     * Else listen to OneTrustLoaded page load event and check if C0003 is part of active groups
     * If C0003 is part of active groups load enhance content
     * **/
    function checkCookieConsentAndLoadContent(): void {
        const oneTrustLoadedEvent = window.dataLayer && window.dataLayer?.find((x: any) => x.event === 'OneTrustGroupsUpdated');

        if (oneTrustLoadedEvent) {
            logger.debug("checkCookieConsentAndLoadContent(): OneTrustGroupsUpdated event found");
            checkEventAndLoadContent(oneTrustLoadedEvent['OnetrustActiveGroups']);
        } else {
            logger.debug("checkCookieConsentAndLoadContent(): Listening to OneTrustGroupsUpdated event");
            window.addEventListener(
                'OneTrustGroupsUpdated',
                oneTrustLoadedEventHandler,
                { once: true }
            );
        }
    }

    /**
     * Function to remove enhance content cookies
     * gets cookie list from banner configurations
     * **/
    function removeEnhanceContentCookies(): void {
        config.enhanceContentCookieList?.forEach(function(cookie: string) {
            Cookies.remove(cookie, { domain: location.hostname })
        })
    }

    useEffect(() => {
        checkCookieConsentAndLoadContent();

        return () => {
            window.removeEventListener('OneTrustGroupsUpdated', oneTrustLoadedEventHandler)
        }
    }, []);

    return (
        <div className="disclaimer-row enhanced-content d-none">
            <div className="row container-row">
                <div className="col-12 detail-section enhanced-content__container" aria-hidden="true">
                    <div className="container-product-more-pdp">
                        <div id="syndi_inline" tabIndex={-1}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withLazyLoad(EnhanceContent);
