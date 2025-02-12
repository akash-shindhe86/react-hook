import { Suspense } from "react";
import { replaceBanner } from "@/server/services/utils";
import aemService from "@/server/services/aem";

async function FooterHtml({ version }: { version: string }) {
    const footer = await aemService.getFooterRender(version);
    return (
        <div>
            <div dangerouslySetInnerHTML={{__html: footer}}></div>
        </div>
    )
}

export default function Footer({ version }: { version: string }) {
    const AEMConfig = aemService.getAEM().config;
    const banner: string = aemService.getAEM().banner!;
    // to load angular js for pdp as spa
    let isPdpAsSpaAngularDisabled = AEMConfig.isPdpAsSpaAngularDisabled;
    return (
        <footer className="App-footer">
            <Suspense fallback={<div className="aem-placeholder footer-placeholder"></div>}>
                <FooterHtml version={version}></FooterHtml>
            </Suspense>
            <script data-testid="post-loadjs"
                    src={replaceBanner(AEMConfig.baseDomainUrl + AEMConfig.sitePostLoadJS, banner)}></script>
            <script data-testid="clientlib-base"
                    src={replaceBanner(AEMConfig.baseDomainUrl + AEMConfig.unifiedClientLibBaseJs, banner)}></script>
            <script data-testid="angularjs"
                    src={replaceBanner(AEMConfig.baseDomainUrl + (isPdpAsSpaAngularDisabled===false?AEMConfig.pdpAsSpaAngularJs:AEMConfig.angularJS), banner)}></script>
            <script data-testid="site-header-js"
                    src={replaceBanner(AEMConfig.baseDomainUrl + AEMConfig.siteHeaderJS, banner)}></script>
            <script data-testid="clientlib-unified-site"
                    src={replaceBanner(AEMConfig.baseDomainUrl + AEMConfig.clientLibSiteJS, banner)}></script>
            <script data-testid="client-lib"
                    src={replaceBanner(AEMConfig.baseDomainUrl + AEMConfig.eddlClientLibUrl, banner)}></script>
        </footer>
    )
}
