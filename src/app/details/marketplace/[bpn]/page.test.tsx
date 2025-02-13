import { render, screen } from '@testing-library/react';
import ProductDetailPage, { generateMetadata } from '@/app/details/marketplace/[bpn]/page';
import { productResponseObject } from "@/server/services/utils";
import { mockProductsByBpnResponse } from "@/mock";

jest.mock('../../../../server/services/utils', () => {
    return {
        ...jest.requireActual('../../../../server/services/utils'),
        productResponseObject: {
            getResolvedProduct: jest.fn().mockResolvedValue({}),
        },
    }
})

jest.mock('wcax-containers-library', () => {
    const PdpSSRContainer = () => <div>PdpSSRContainer</div>;
    const DisclaimerContainer = () => <div>DisclaimerContainer</div>;
    const WarningsContainer = () => <div>WarningsContainer</div>;

    return {
        PdpSSRContainer,
        DisclaimerContainer,
        WarningsContainer,
        getDisclaimerResponseHandler: jest.fn().mockResolvedValue('disclaimer HTML'),
    };
});
jest.mock('../../../../server/services/aem', () => {
    return {
        getAEM: jest.fn().mockReturnValue({
            banner: 'safeway',
            config: {
                baseUrl: 'https://www-dev1.safeway.com',
                baseDomainUrl: 'https://www-dev1.safeway.com'
            }
        })
    }
});
jest.mock('../../../../client/components/enhance-content/EnhanceContent', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => (
        <div>EnhanceContent</div>
    )),
}));
jest.mock('../../../../client/components/CommonComponent', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => (
        <div>CommonComponent</div>
    )),
}));
jest.mock('../../../../server/components/AngularComponents/AngularComponents', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => (
        <div>AngularComponents</div>
    )),
}));

describe('ProductDetailPage', () => {
    it('should render the ProductDetailPage component', async () => {
        const params = { bpn: '960120624' };
        const searchParams = { mode: ''};
        productResponseObject.resolvedResponseByBpn = { [params.bpn]: () => {} };
        render(await ProductDetailPage({ params, searchParams }));
        expect(screen.getByText('PdpSSRContainer')).toBeInTheDocument();
        expect(screen.getByText('EnhanceContent')).toBeInTheDocument();
        expect(screen.getByText('DisclaimerContainer')).toBeInTheDocument();
        expect(screen.getByText('WarningsContainer')).toBeInTheDocument();
    });

    it('should generate expected metadata if product detail is not available when generateMetadata called', async() => {
        const params = { bpn: '12345'};
        (productResponseObject.getResolvedProduct as jest.Mock).mockResolvedValue({});
        productResponseObject.resolvedResponseByBpn = { [params.bpn]: () => {} };
        const metadata = await generateMetadata({ params });

        const openGraph = {
            siteName: "safeway",
            type: "website",
            url: 'https://www-dev1.safeway.com/shop/product-details.12345.html',
        }

        expect(metadata.title).toBeUndefined();
        expect(metadata.description).toBeUndefined();
        expect(metadata.alternates?.canonical).toEqual('https://www-dev1.safeway.com/shop/product-details.12345.html');
        expect(metadata.openGraph).toEqual(openGraph);
        expect(productResponseObject.resolvedResponseByBpn).toEqual({});
    });
    it('should generate metadata with product detail if product detail is available when generateMetadata called', async() => {
        const product = mockProductsByBpnResponse.response.docs[0];
        global.Promise = { resolve: jest.fn().mockReturnValue(product) } as unknown as PromiseConstructor;
        const params = { bpn: '12345'};
        (productResponseObject.getResolvedProduct as jest.Mock).mockResolvedValue(product);
        productResponseObject.resolvedResponseByBpn = { [params.bpn]: () => {} };
        const metadata = await generateMetadata({ params });

        const description = `Shop ${product.name} from safeway. Browse our wide selection of ${product.shelfName} for Delivery or Drive Up & Go to pick up at the store!`
        const openGraph = {
            description: description,
            images: [{"url": "https://images.albertsons-media.com/is/image/ABS/12345?$ng-ecom-pdp-desktop$&defaultImage=Not_Available"}],
            siteName: "safeway",
            title: `${product.name} - safeway`,
            type: "website",
            url: 'https://www-dev1.safeway.com/shop/product-details.12345.html'
        }

        expect(metadata.title).toEqual(`${product.name} - safeway`);
        expect(metadata.description).toEqual(description);
        expect(metadata.alternates?.canonical).toEqual('https://www-dev1.safeway.com/shop/product-details.12345.html');
        expect(metadata.openGraph).toEqual(openGraph);
        expect(productResponseObject.resolvedResponseByBpn).toEqual({});
    });

    it('should generate metadata with product detail if product detail and multiple images are available when generateMetadata called', async() => {
        const images = {
            items: [
                {
                    "image": "971046582-C1N1"
                },
                {
                    "image": "971046582-H1N1"
                },
                {
                    "image": "971046582-U1N1"
                },
                {
                    "image": "971046582-L2"
                },
                {
                    "image": "971046582-L4"
                }
            ],
            "appCode": "S7:200"
        }
        const product = {
            ...mockProductsByBpnResponse.response.docs[0],
            images: images
        };
        const params = { bpn: '12345'};
        global.Promise = { resolve: jest.fn().mockReturnValue(product) } as unknown as PromiseConstructor;
        (productResponseObject.getResolvedProduct as jest.Mock).mockResolvedValue(product);
        productResponseObject.resolvedResponseByBpn = { [params.bpn]: () => {} };
        const metadata = await generateMetadata({ params });

        const description = `Shop ${product.name} from safeway. Browse our wide selection of ${product.shelfName} for Delivery or Drive Up & Go to pick up at the store!`
        const openGraph = {
            description: description,
            images: [{"url": `https://images.albertsons-media.com/is/image/ABS/${images.items[0].image}?$ng-ecom-pdp-desktop$&defaultImage=Not_Available`}],
            siteName: "safeway",
            title: `${product.name} - safeway`,
            type: "website",
            url: 'https://www-dev1.safeway.com/shop/product-details.12345.html'
        }

        expect(metadata.title).toEqual(`${product.name} - safeway`);
        expect(metadata.description).toEqual(description);
        expect(metadata.alternates?.canonical).toEqual('https://www-dev1.safeway.com/shop/product-details.12345.html');
        expect(metadata.openGraph).toEqual(openGraph);
        expect(productResponseObject.resolvedResponseByBpn).toEqual({});
    });
});
