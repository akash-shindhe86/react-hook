import { parse } from 'node-html-parser';
import { Metadata } from "next";
import aemService from "@/server/services/aem";

export function replaceBanner(string: string = '', banner: string = '') {
    return string.replace(/\{banner\}/g, banner);
}

export const getHTMLBySelector = (html: string, selector: string):string => {
    const parseHTML = parse(html);

    const parseContent = parseHTML?.querySelector(selector);
    return parseContent ? parseContent.toString() : '';
}

export const buildQueryParams = (reqParamObj: any): string=>{
    let queryParams = "?";
    const getReviewsReqKeys = Object.keys(reqParamObj);
    if(getReviewsReqKeys && getReviewsReqKeys.length>0){
        getReviewsReqKeys.forEach((objKey:string)=>{
            queryParams =queryParams+objKey+"="+reqParamObj[objKey]+"&";
        })
    }
    return queryParams;
}

// making sure that response should contain HTML tag
export const checkIsHTMLContent = (content: string) => {
    let isHTMLContent = false;
    if(/<\/?[a-z][\s\S]*>/i.test(content)) {
        isHTMLContent = true;
    }
    return isHTMLContent;
}

export function generateProductNameForMetadata(productName: string) {
    if(!productName || productName==='')
        return ''

    return productName.split("-").map(str => str[0].toUpperCase() + str.slice(1)).join(' ');
}

/**
 * this method will perform empty/null/undefined checks and returns a boolean.
 * Should not use this method for boolean and number emptyness.
 */
export function isEmpty(obj: any) {
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

/*
* This method will return the resolved product response object based on bpn
 */
export const productResponseObject: any = {
    resolvedResponseByBpn: {},
    getResolvedProduct: (bpn: string) => {
        return new Promise((resolveMethod)=> {
            // if product is already resolved then return the resolved product
            if(!productResponseObject.resolvedResponseByBpn.hasOwnProperty(bpn)) {
                productResponseObject.resolvedResponseByBpn[bpn] = resolveMethod
            }
        });
    }
}

export function getPDPMetaData(bpn: string, product: any, programType: string = 'abs'): Metadata {
    const AEMConfig = aemService.getAEM().config!;
    const banner: string = aemService.getAEM().banner!;
    const url: string = `${replaceBanner(AEMConfig.baseDomainUrl, banner)}/shop/product-details.${bpn}.html`

    let metadata: Metadata = {
        robots: {
            index: programType === 'abs',
            follow: programType === 'abs',
        },
        alternates:{
            canonical: url,
        },
        openGraph: {
            type: 'website',
            url: url,
            siteName: banner
        },
        twitter: {
            card: 'summary'
        }
    }
    if(!isEmpty(product)) {
        // get the first image of the product to set as og:image or use bpn as default image
        const imageName = product.images?.items?.length > 0 ? product.images.items[0].image : bpn;
        if(product.name) {
            metadata = {
                ...metadata,
                title: `${product.name} - ${banner}`,
                description: `Shop ${product.name} from ${banner}. Browse our wide selection of ${product.shelfName} for Delivery or Drive Up & Go to pick up at the store!`,
                openGraph: {
                    ...metadata.openGraph,
                    title: `${product.name} - ${banner}`,
                    description: `Shop ${product.name} from ${banner}. Browse our wide selection of ${product.shelfName} for Delivery or Drive Up & Go to pick up at the store!`
                }
            }
        }
        if (metadata.openGraph) {
            metadata.openGraph.images = [{
                url: `https://images.albertsons-media.com/is/image/ABS/${imageName}?$ng-ecom-pdp-desktop$&defaultImage=Not_Available`
            }]
        }
    }
    return metadata;
}

// This method will return the cache tag based on the url, referer, bpn, banner and env
export function getCacheTag(url: string, referer: any, bpn: string, banner: string, env: string) {
    let cacheTag = `p_${env}_pdp,p_${env}_${banner},p_${env}_product-details.${bpn},p_${env}_${banner}_pdp`;
    if(url?.includes('/marketplace') || referer?.includes('/marketplace')) {
        cacheTag = `${cacheTag},p_${env}_marketplace`;
    }
    else if(url?.includes('/vineandcellar') || referer?.includes('/vineandcellar')) {
        cacheTag = `${cacheTag},p_${env}_vineandcellar`;
    }
    return cacheTag;
}
