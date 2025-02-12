import aemService from "../../../server/services/aem";
 
export function getBanner() {
    const banner = aemService.getAEM().banner;
    return banner;
}

const AngularComponents = async ({ config, componentType, configObj, isBannerBelowTheFold = true, productResponsePromise }: { config: any, componentType?: string, configObj?: any, isBannerBelowTheFold?: boolean, productResponsePromise? : any }) => {
    const { apimBasePath, mealSubcriptionKey } = config;
    const fiveDigitRandomNumber = Math.floor(Math.random() * 90000) + 10000;
    const bannerPath = getBanner();
    let resolvedProductResponse: any = {};

    // This is a promise that resolves to the product object
    if(productResponsePromise) {
        resolvedProductResponse = await Promise.resolve(productResponsePromise);
    }

    const bannerComponent = (bannerType: string, position: string, isNonEndemicBanner?: boolean) => {
        if (bannerPath !== 'andronicos' && bannerPath !== 'haggen' && bannerPath !== 'balduccis' && bannerPath !== 'kingsfoodmarkets' && (!configObj || (configObj && (!configObj.programType || configObj.programType === 'abs')))) {
            return (
                `
<div class="nextgen-banner-unit-proxy banner-unit banner-unit-rules section">
    <div class="google-adManager google-adManager--${isNonEndemicBanner ? 'NonEndemicBanner full-width-80pxtop-horizontal-line full-width-center-banner-80pxtop-20pxbottom' : bannerType} nextgen-banner-unit__injection nextgen-banner-unit banner-unit__injection--loading-animation">
       <gam-section
           id="gamSection_${fiveDigitRandomNumber}"
           data-gamId="${fiveDigitRandomNumber}"
           role="presentation"
           data-fulfillmentChannel='["DEL","INS", "PUP"]'
           data-fluid="${isNonEndemicBanner ? !isNonEndemicBanner : true}"
           data-adUnitPath="${bannerPath || ''}/product-details/*/*.*"
           data-bannerPosition="${position}"
           data-sizeMappings="${isNonEndemicBanner ? '[[[1024,250], [[728,90]]], [[360,240], [[300,250]]]]' : '[]'}"
           data-taxonomyId="ProductAlike"
           data-aisleId="1_"
           data-bannerSizes="${isNonEndemicBanner ? '[[300,250], [728,90]]' : '[]'}"
           data-insideCarousel="false"
           data-lastSponsoredBannerInCarousel="false"
           data-gamNetworkCode="prod:22389494054,nonprod:22825627079"
           data-gamFeatureFlag="disableGAM"
           data-gamFeatureFlagValue="true"
           data-bannerVariation="${bannerType}"
           data-pageId="product-details">
       </gam-section>
       
       <script type = "text/javascript" charset = "utf-8" >
           function loadAdXContent_${fiveDigitRandomNumber} () {
               if(window.checkAdBlocker !== undefined) {
                   if(checkGamFeatureFlag(\`disableGAM\`,\`true\`,\`gamSection_${fiveDigitRandomNumber}\`)) {
                       const gamData_${fiveDigitRandomNumber} = gamParamCall('gamSection_${fiveDigitRandomNumber}');
                       // Check to invoke slotGenerator only after that function has already been loaded by GPT limited ads script.
                       if (typeof slotGenerator === "function" && gamData_${fiveDigitRandomNumber} != null) {
                           const txPathValue = gamData_${fiveDigitRandomNumber}?.detail?.targeting?.find(item => item?.txpath)?.txpath;
                           const isAlcoholCategory = txPathValue?.startsWith("1_29");
                           if (!isAlcoholCategory) {
                             slotGenerator(gamData_${fiveDigitRandomNumber}.detail,"gamcontainer_${fiveDigitRandomNumber}");
                           } else {
                               const bannerUnit = document.querySelector('.nextgen-banner-unit-proxy');
                               bannerUnit.remove();
                           }
                       }
                   }
               }
               else{
                   window.addEventListener("adBlockerLoadChecked", function () {
                       loadAdXContent_${fiveDigitRandomNumber}();
                   });
               }
           }
               if(${isBannerBelowTheFold}){
                 window.lazyFunctions = window.lazyFunctions || {};
                 window.lazyFunctions.lazyAdXContent_${fiveDigitRandomNumber} = function(element) {
                   loadAdXContent_${fiveDigitRandomNumber}();
               } 
           }          
               else{
                 $( document ).ready(function() { 
                   loadAdXContent_${fiveDigitRandomNumber}();
                  });
                }             
       </script>
        <span class="sr-only gam-adContentLabel">Sponsored 3rd party ad content </span>
       <div class="${(isBannerBelowTheFold) ? 'ab-lazy-function' : ''}"  data-lazy-function="lazyAdXContent_${fiveDigitRandomNumber}" id="gamcontainer_${fiveDigitRandomNumber}"></div>   </div>
   </div>
    `
            )
        }
        return ``;
    };

    const mostPopularCarouselComponentHTML = () => {
        if (!configObj || (configObj && (!configObj.programType || configObj.programType === 'abs')) && resolvedProductResponse.isProductTrackingDisabled !== true) {
            return (`
                <div class="master-product-carousel section static-carousel">
                    <div class="slick-product-carousel clearfix  preset-block-height" data-qa="prd-crsl">
                        <div class="carousel-header-wrapper">
                            <div class="carousel-header-text-wrapper">
                                <h2 class="carousel-header-text m0" data-qa="prd-crsl-hdng-ftrd-tms">Similar Items</h2>
                            </div>
                        </div>
                        <lazy-wrapper 
                            data-lazy-component="product-carousel"
                            data-carousel-type="apidriven"
                            data-carousel-title="Similar Items"
                            data-carousel-users="false"
                            data-carousel-action="qty-stepper"
                            data-carousel-api="${apimBasePath}/xapi/pdreco/carousel?storeId={storeId}&mbox=pdp-1&entity.id={bpn}&thirdPartyId={houseHoldId}&pageURL={pageURL}&host={host}&numberOfProducts=12&excludedIds={excludedIds}&departmentId={deptL2Id}&aisleId={aisleL3Id}&shelfId={shelfL4Id}"
                            data-carousel-api-post="1_"
                            data-carousel-max-products="12"
                            data-include-offer="true"
                            data-navigation-type="page-by-page"
                            data-carousel-pdp="true"
                            data-seller-type="${configObj && configObj.programType ? configObj.programType : 'abs'}">
                        </lazy-wrapper >  
                    </div>
                </div>
            `)
        }
        return ``;
    };

    const mostPopularMarketPlaceCarouselComponentHTML = () => {
        if (configObj && configObj.programType === 'mkp') {
            return (`
                <div class="master-product-carousel section static-carousel">
                    <div class="slick-product-carousel clearfix slick-product-carousel--block-height-wall-guarded" data-qa="prd-crsl">
                        <div class="carousel-header-wrapper">
                            <div class="carousel-header-text-wrapper">
                                <h2 class="carousel-header-text m0" data-qa="prd-crsl-hdng-mst-pplr-frm-{sllrnm}">Most Popular from ${resolvedProductResponse.sellerName}</h2>
                            </div>
                        </div>
                        <lazy-wrapper
                            data-lazy-component="product-carousel"
                            data-carousel-type="apidriven"
                            data-carousel-title="Most Popular from ${resolvedProductResponse.sellerName}"
                            data-carousel-users="false"
                            data-carousel-action="qty-stepper"
                            data-carousel-api="${apimBasePath}/xapi/pdreco/carousel?storeId={storeId}&mbox=mkp-pdp-1&entity.id={bpn}&thirdPartyId={houseHoldId}&pageURL={pageURL}&host={host}&;numberOfProducts=12&excludedIds={excludedIds}&departmentId={deptL2Id}&aisleId={aisleL3Id}&shelfId={shelfL4Id}"
                            data-carousel-api-post="1_"
                            data-carousel-max-products="12"
                            data-navigation-type="page-by-page"
                            data-seller-type="mkp"
                            data-carousel-pdp="true"
                            data-carousel-seller-id="${resolvedProductResponse.sellerId}">
                        </lazy-wrapper>
                    </div>
                </div>
            `)
        }
        return ``;
    };

    const recipeCarouselComponentHTML = () => {
        if (!configObj || (configObj && (!configObj.programType || configObj.programType === 'abs' || configObj.programType === '1P_B2B'))) {
            return (`
                <div class="meal-carousel section">
                    <div class="slick-meal-carousel">
                        <lazy-wrapper
                            data-lazy-component="meal-carousel"
                            data-carousel-title="Try these recipes"
                            data-carousel-page="productPage"
                            data-carousel-render="clientSide"
                            data-carousel-max-recipes="12"
                            data-carousel-api="${apimBasePath}/dirm/menuservice/v2/recipe-discovery/by-bpn?storeId={storeId}&offset={offset}&pageSize=12&bpn={bpn}"
                            data-carousel-subscription-key="${mealSubcriptionKey}">
                        </lazy-wrapper> 
                    </div>
                </div>
            `)
        }
        return ``;
    };

    const featuredItemsCarouselComponentHTML = () => {
        if ((!configObj || (configObj && (!configObj.programType || configObj.programType === 'abs' || configObj.programType === '1P_B2B')))) {
            return (`
                <div class="master-product-carousel section static-carousel">
                    <div class="slick-product-carousel clearfix  preset-block-height" data-qa="prd-crsl">
                        <div class="carousel-header-wrapper">
                            <div class="carousel-header-text-wrapper">
                                <h2 class="carousel-header-text m0" data-qa="prd-crsl-hdng-ftrd-tms">Featured Items</h2>
                            </div>       
                        </div>
                        <lazy-wrapper 
                            data-lazy-component="product-carousel"
                            data-carousel-type="apidriven"
                            data-carousel-title="Featured Items"
                            data-carousel-users="false"
                            data-carousel-action="qty-stepper"
                            data-carousel-driven="featured-products"
                            data-carousel-api="${apimBasePath}/xapi/search/sponsored-carousel?userid={userId}&featuredsessionid={featuredSessionId}&screenwidth={screenWidth}&storeid={storeId}&banner={banner}&max-result=14&pagename=product-details&category-id={shelfId}&exclude-bpn={bpnId}"
                            data-carousel-api-post="1_"
                            data-carousel-max-products="14"
                            data-include-offer="true"
                            data-navigation-type="page-by-page"
                            data-carousel-pdp="false"
                            data-seller-type="${configObj && configObj.programType ? configObj.programType : 'abs'}">
                        </lazy-wrapper >
                    </div>
                </div>
            `)
        }
        return ``;
    };

    const angularComponentHTML = `
        ${mostPopularCarouselComponentHTML()}  
        ${mostPopularMarketPlaceCarouselComponentHTML()}
        ${recipeCarouselComponentHTML()}
        ${featuredItemsCarouselComponentHTML()}
        ${bannerComponent('MediumBanner', 'midb1')}    `;

    const couponsComponent: string = `
        <lazy-wrapper 
            data-lazy-component="coupon-carousel"
            data-carousel-filter="pdp"
            data-calledby="pdp-spa">
        </lazy-wrapper >
    `;

    let renderHtml = angularComponentHTML;
    if (componentType === 'ultraSkinnyBanner') {
        renderHtml = bannerComponent('UltraSkinnyBanner', 'topb1');
    } else if (componentType === 'nonEndemicBanner') {
        renderHtml = bannerComponent('UltraSkinnyBanner', 'bottomb1', true)
    } else if (componentType === 'couponsCarousel') {
        renderHtml = couponsComponent;
    }
    return <div dangerouslySetInnerHTML={{ __html: renderHtml }}></div>;
};
export default AngularComponents;