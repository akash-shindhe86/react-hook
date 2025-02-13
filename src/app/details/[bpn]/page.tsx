// @ts-ignore
import { PdpSSRContainer, DisclaimerContainer, getDisclaimerResponseHandler, WarningsContainer } from "wcax-containers-library";
import { Suspense } from "react";
import aemService from "@/server/services/aem";
import CommonComponent from "@/client/components/CommonComponent";
import EnhanceContent from "@/client/components/enhance-content/EnhanceContent";
import AngularComponents from "@/server/components/AngularComponents/AngularComponents";
import { getPDPMetaData, productResponseObject } from "@/server/services/utils";

const configObj = { programType: 'abs', pageType: 'pdp'};
let productResponsePromise: any; // This is a promise that resolves to the product object

export async function generateMetadata(
    { params }: { params: { bpn: string } }
) {
    const product = await Promise.resolve(productResponsePromise);
    productResponsePromise = null;
    if(productResponseObject.resolvedResponseByBpn[params.bpn]) {
        delete productResponseObject.resolvedResponseByBpn[params.bpn];
    }
    return getPDPMetaData(params.bpn, product, configObj.programType);
}

export default async function ProductDetailPage({ params, searchParams }: { params: { bpn: string }, searchParams: { mode: string } }) {
    const config = aemService.getAEM().config!;
    const banner: string = aemService.getAEM().banner!;

    // save productResponsePromise to a variable so that it can be used in metadata generation
    productResponsePromise = productResponseObject.getResolvedProduct(params.bpn);

    return (
        <main className="main-wrapper">
            <div className="full-bleed-container">
                <div className="full-bleed-row">
                    <div className="product-wrapper-v2 product-wrapper-v2--details section mt-0">
                        <div className="container-fluid px-0 product-details-wrapper" data-bpn={params.bpn} >
                            <PdpSSRContainer productResponseForMetaData={productResponseObject.resolvedResponseByBpn[params.bpn]} banner={banner} config={config} bpn={params.bpn} mode={searchParams.mode} configObj={configObj} ultraSkinnyBanner = {<AngularComponents config={config} isBannerBelowTheFold={false} componentType = {'ultraSkinnyBanner'}/>}
                                             couponsCarousel={<AngularComponents config={config} componentType={'couponsCarousel'}/>}/>
                            <AngularComponents config={config} componentType = {'angularComp'} isBannerBelowTheFold={true} productResponsePromise={productResponsePromise} configObj={configObj} />
                            <EnhanceContent config={config} bpn={params.bpn}/>
                            <Suspense fallback={<div className="placeholder disclaimer-placeholder"></div>}>
                                <DisclaimerContainer config={config} banner={banner} />
                            </Suspense>
                            <WarningsContainer/>
                            <div className="placeholder section">
                                <div id="linkblock-placeholder" data-qa="test-linkblock-placeholder"></div>
                            </div>
                            <AngularComponents config={config} componentType = {'nonEndemicBanner'} isBannerBelowTheFold={true}/>
                            <CommonComponent configObj={configObj} config = {config}/>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

