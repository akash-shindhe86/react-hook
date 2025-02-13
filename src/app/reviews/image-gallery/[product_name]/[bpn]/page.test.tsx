import { render } from '@testing-library/react';
import ImageGalleryPage, { generateMetadata } from '@/app/reviews/image-gallery/[product_name]/[bpn]/page';
import envConfig from "@/server/config";
import aemService from "@/server/services/aem";

jest.mock('wcax-containers-library/lib', () => {
    return {ProductReviewsSSRContainer: ()=><div />
    }
});

jest.mock('../../../../../server/services/aem', () => {
    return {
         getAEM: jest.fn()
    }
});
jest.mock('../../../../../client/components/CommonComponent', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => (
        <div className = "App-footer">CommonComponent</div>
    )),
}));
const banner: string = 'safeway';
const config = envConfig["B2C"]['dev'];

describe('Pages: review-gallery', () => {
    beforeEach(() => {
        aemService.getAEM.mockClear();
    })

    it('should render review gallery page', async() => {
        aemService.getAEM.mockReturnValue({
            config,
            banner
        })
        const searchParams = { mode: '', source: ''};
        const { container } = render(await ImageGalleryPage({params: { product_name: '', bpn: ''}, searchParams}));
        expect(container).toBeTruthy();
    });

    it('should test generateMetadata', async() => {
        aemService.getAEM.mockReturnValue({
            config,
            banner
        })
        const searchParams = { mode: '', source: ''};
        const params = { product_name: 'milk-egg-chicken', bpn: '12345'};
        const metadata = generateMetadata({params, searchParams});
        expect(metadata.title).toEqual('Milk Egg Chicken Pics, Images and Videos | safeway');
        expect(metadata.description).toEqual('Customer reviewed pics, images and videos of Milk Egg Chicken located here. Get close up pictures and images of Milk Egg Chicken as well as videos of Milk Egg Chicken from real customers who shopped with us right here.');
        expect(metadata.alternates?.canonical).toEqual('https://www-dev1.safeway.com/product/reviews/image-gallery/milk-egg-chicken/12345');
    });

    it('should test generateMetadata when product name and bpn are empty', async() => {
        aemService.getAEM.mockReturnValue({
            config,
            banner
        })
        const searchParams = { mode: '', source: ''};
        const params = { product_name: '', bpn: ''};
        const metadata = generateMetadata({params, searchParams});
        expect(metadata.hasOwnProperty('title')).toEqual(false);
        expect(metadata.hasOwnProperty('description')).toEqual(false);
        expect(metadata.alternates?.canonical).toEqual('https://www-dev1.safeway.com/product/reviews/image-gallery//');
    });
})
