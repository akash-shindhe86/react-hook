// @ts-ignore
import { ProductReviewsSSRContainer } from 'wcax-containers-library'
import aemService from "@/server/services/aem";
import type { Metadata } from 'next';
import { generateProductNameForMetadata } from '@/server/services/utils';
import { replaceBanner } from '@/server/services/utils';
import { ReviewProps } from '@/types';
import CommonComponent from "@/client/components/CommonComponent";

export function generateMetadata(
  { params }: ReviewProps
) {
    const AEMConfig = aemService.getAEM().config!;
    const banner: string = aemService.getAEM().banner!;
    const productNameMetaData = generateProductNameForMetadata(params.product_name);
    const metadata : Metadata = {
      robots: {
        index: true,
        follow: true
      },
      alternates:{
        canonical: `${replaceBanner(AEMConfig.baseDomainUrl, banner)}/product/reviews/${params.product_name}/${params.bpn}`
      }
    }

    if(productNameMetaData) {
      metadata.title = `${productNameMetaData} Reviews - ${productNameMetaData} Ratings | ${banner.charAt(0).toUpperCase() + banner.slice(1)}`;
      metadata.description = `${productNameMetaData} reviews and ratings from our shoppers. Read product reviews of ${productNameMetaData} from real customers who shopped with us and see what they had to say. Check out their photos and videos in our review section as well.`;
    }

  return metadata;
}

export default function ReviewsPage({ params, searchParams }: ReviewProps) {

  const config = aemService.getAEM().config!;
  const banner: string = aemService.getAEM().banner!;
  const productNameMetaData = generateProductNameForMetadata(params.product_name);
  const configObj = { programType: 'abs', pageType: 'reviews'}
    
  return (
    <main className="main-wrapper">
      { productNameMetaData && <h1 className="hidden-title">{`${productNameMetaData} Ratings & Reviews`}</h1> }
      <div className="full-bleed-container">
        <div className="full-bleed-row">
          <div className="row">
            <div className="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-8">
              <ProductReviewsSSRContainer source={searchParams.source} productName={params.product_name} bpn={params.bpn} banner={banner} config={config} configObj={configObj} mode={searchParams.mode}></ProductReviewsSSRContainer>
            </div>
          </div>
        </div>
      </div>
        <CommonComponent configObj={configObj} config = {config}/>
    </main>
  )
}
