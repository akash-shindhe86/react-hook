import { render } from '@testing-library/react';
import ReviewsPage, { generateMetadata } from '@/app/reviews/[product_name]/[bpn]/page';
import envConfig from "@/server/config";
import aemService from "@/server/services/aem";

jest.mock('wcax-containers-library/lib', () => {
    return {ProductReviewsSSRContainer: ()=><div />
    }
});

jest.mock('../../../../server/services/aem', () => {
    return {
        getAEM: jest.fn()
    }
});
jest.mock('../../../../client/components/CommonComponent', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => (
        <div className = "App-footer">CommonComponent</div>
    )),
}));
const banner: string = 'safeway';
const config = envConfig["B2C"]['dev'];

describe('Pages: reviews', () => {
    beforeEach(() => {
        aemService.getAEM.mockClear();
    })

    it('should render reviews page', async() => {
        aemService.getAEM.mockReturnValue({
            config,
            banner
        })

        const searchParams = { mode: '', source: ''};
        const { container } = render(await ReviewsPage({params: { product_name: '', bpn: ''}, searchParams}));
        expect(container).toBeTruthy();
    });

    it('should test generateMetadata', async() => {
        aemService.getAEM.mockReturnValue({
            config,
            banner
        })
        const searchParams = { mode: '', source: ''};
        const params = { product_name: 'milk', bpn: '12345'};
        const metadata = generateMetadata({params, searchParams});
        expect(metadata.title).toEqual('Milk Reviews - Milk Ratings | Safeway');
        expect(metadata.description).toEqual('Milk reviews and ratings from our shoppers. Read product reviews of Milk from real customers who shopped with us and see what they had to say. Check out their photos and videos in our review section as well.');
        expect(metadata.alternates?.canonical).toEqual('https://www-dev1.safeway.com/product/reviews/milk/12345');
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
        expect(metadata.alternates?.canonical).toEqual('https://www-dev1.safeway.com/product/reviews//');
    });
})
