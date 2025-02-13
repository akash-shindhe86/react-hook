import parse from 'html-react-parser';

import aemService from '@/server/services/aem';
import { replaceBanner } from '@/server/services/utils';
import themeMapper from '@/theme-mapper/themeMapper';
import CaptchaScript from "@/client/components/captcha-script/CaptchaScript";

export default function Head({ onloadEventHtml } : { onloadEventHtml: string }) {
    const AEMConfig = aemService.getAEM().config!;
    const banner: string = aemService.getAEM().banner;
    const AEM_jQUERY: string = replaceBanner(AEMConfig.baseDomainUrl+AEMConfig.jQuery, banner);
    const AEM_SITE_HEADER_CSS: string = replaceBanner(AEMConfig.baseDomainUrl+AEMConfig.siteHeaderCSS, banner);
    const AEM_SITE_ONLOAD_JS: string = replaceBanner(AEMConfig.baseDomainUrl+AEMConfig.siteOnLoadJS, banner);
    const AEM_CLIENT_LIB_CSS: string = replaceBanner(AEMConfig.baseDomainUrl+AEMConfig.clientLibSiteCSS, banner);
    const GAM_CLIENTLIBS_JS: string = replaceBanner(AEMConfig.baseDomainUrl+AEMConfig.gamClientLibsJs, banner);
    const AEM_LAZYLOAD_CLIENTLIB_JS: string = replaceBanner(AEMConfig.baseDomainUrl+AEMConfig.aemLazyLoadClientlibJs, banner);

    return (
        <head>
            <CaptchaScript/>
            <meta httpEquiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' https://* 'unsafe-eval';
                img-src 'self' https://* data: ;
                style-src 'self' 'unsafe-inline' https://*;
                child-src 'self' 'unsafe-inline' https://* 'unsafe-eval' blob: ;"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta name="template" content="product-detail-page"/>
            <meta name="allowedUserTypes" content="%5B%22A%22%2C%22G%22%2C%22R%22%2C%22C%22%5D"/>
            <meta name="allowGuestAuthentication" content="true"/>
            <meta name="redirections" content="%5B%5D"/>
            <meta name="showZipcodeModal" content="true"/>
            {parse(`<style type="text/css" id="allAlertCSS">.hideAllAlert{display:none!important}</style>`)}
            <link rel="preconnect" href="https://images.albertsons-media.com/" />
            <link rel="preconnect" href="https://assets.adobedtm.com" />

            <link rel="dns-prefetch" href="//cm.everesttech.net"/>
            <link rel="dns-prefetch" href="//safewayinc.tt.omtrdc.net"/>
            <link rel="dns-prefetch" href="//safewayinc.demdex.net"/>
            <link rel="dns-prefetch" href="//stats.safeway.com"/>
            <link rel="dns-prefetch" href="//www.google-analytics.com"/>
            <link rel="dns-prefetch" href="//s.pinimg.com"/>
            <link rel="dns-prefetch" href="//media-lax1.inq.com"/>
            <link rel="dns-prefetch" href="//ct.pinterest.com"/>
            <link rel="dns-prefetch" href="//connect.facebook.net"/>
            <link rel="dns-prefetch" href="//albertsons.okta.com"/>
            <link rel="dns-prefetch" href="//di.rlcdn.com"/>
            <link rel="dns-prefetch" href="//albertsons.inq.com"/>

            <link rel="preload" href={AEM_jQUERY} as="script" />
            <link rel="preload" href={replaceBanner(AEMConfig.baseDomainUrl + AEMConfig.unifiedClientLibBaseJs, banner)} as="script" />

            <script data-testid="jqueryjs" src={AEM_jQUERY}></script>
            <script data-testid="on-loadjs" src={AEM_SITE_ONLOAD_JS}></script>
            {onloadEventHtml && parse(onloadEventHtml)}
            <script data-testid="aem-lazyload-loadjs" src={AEM_LAZYLOAD_CLIENTLIB_JS} defer></script>
            <script data-testid="aem-gamjs" src={GAM_CLIENTLIBS_JS}></script>
            <link rel="icon" type="image/png" href={`/product/favicons/${banner}.ico`}/>

            <link rel="preload" href={AEM_SITE_HEADER_CSS} as="style"/>
            <link rel="preload" href={AEM_CLIENT_LIB_CSS} as="style"/>
            <link rel="preload" href={`${replaceBanner(AEMConfig.baseDomainUrl, banner)}/product/_DST/ecom-banner-styles_${(themeMapper as any)[banner]}.css`}
                  as="style"/>

            <link href={AEM_SITE_HEADER_CSS} rel="stylesheet"/>
            <link href={AEM_CLIENT_LIB_CSS} rel="stylesheet"/>
            <link href={`/product/_DST/ecom-banner-styles_${(themeMapper as any)[banner]}.css`}
                  rel="stylesheet"/>
            <script data-testid="analytics" src={AEMConfig.analyticsUrl}></script>
        </head>
    )
}
