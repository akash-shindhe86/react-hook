// @ts-ignore
import { ProductReviewsSSRContainer } from 'wcax-containers-library'
import aemService from "@/server/services/aem";
import type { Metadata } from 'next';
import { generateProductNameForMetadata, replaceBanner } from '@/server/services/utils';
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
        canonical: `${replaceBanner(AEMConfig.baseDomainUrl, banner)}/product/reviews/image-gallery/${params.product_name}/${params.bpn}`
      }
    }

    if(productNameMetaData) {
      metadata.title = `${productNameMetaData} Pics, Images and Videos | ${banner}`;
      metadata.description = `Customer reviewed pics, images and videos of ${productNameMetaData} located here. Get close up pictures and images of ${productNameMetaData} as well as videos of ${productNameMetaData} from real customers who shopped with us right here.`;
    }

  return metadata;
}
 
export default function ImageGalleryPage({ params, searchParams }: ReviewProps) {
  const config = aemService.getAEM().config!;
  const banner: string = aemService.getAEM().banner!;
  const productNameMetaData = generateProductNameForMetadata(params.product_name);
    const configObj = { programType: 'abs', pageType: 'reviews'}
  return (
    <main className="main-wrapper">
      { productNameMetaData && <h1 className="hidden-title">{`${productNameMetaData} Media & Image Gallery`}</h1> }
      <ProductReviewsSSRContainer source={searchParams.source} productName={params.product_name} bpn={params.bpn} banner={banner} config={config} isReviewGallery mode={searchParams.mode} />
        <CommonComponent configObj={configObj} config = {config}/>
    </main>
  );
}
