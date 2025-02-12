import {
    replaceBanner,
    getHTMLBySelector,
    generateProductNameForMetadata,
    getPDPMetaData,
    productResponseObject,
    isEmpty,
    getCacheTag
} from '@/server/services/utils';
import { mockProductsByBpnResponse } from "@/mock";

jest.mock('./aem', () => {
    return {
        getAEM: jest.fn().mockReturnValue({
            banner: 'safeway',
            config: {
                baseDomainUrl: 'https://business-dev1.safeway.com'
            }
        })
    }
});

describe('Utils', () => {
    it('should replace banner from URL', () => {
        const checkSumUrl: string = 'https://www-dev2.{banner}.com/bin/safeway/app-version';
        const banner: string = 'safeway';
        expect(replaceBanner(checkSumUrl, banner)).toBe(`https://www-dev2.safeway.com/bin/${banner}/app-version`)
    });

    it('should return HTML based on passed selector', () => {
        const selector: string = 'root';
        const content :string = `<p class="${selector}">dummy HTML</p>`
        const html: string = `<div class="parent">${content}</div>`;
        expect(getHTMLBySelector(html, `.${selector}`)).toBe(content)
    });

    it('should test generateProductNameForMetadata()', () => {
        const productName = 'lucerne-milk-whole-1-gallon';
        expect(generateProductNameForMetadata(productName)).toEqual('Lucerne Milk Whole 1 Gallon');
        const productName1 = '';
        expect(generateProductNameForMetadata(productName1)).toEqual('');
    });

    it('should returns true for null, undefined, empty string, empty array, empty object ', () => {
        expect(isEmpty(null)).toBe(true);
        expect(isEmpty(undefined)).toBe(true);
        expect(isEmpty('')).toBe(true);
        expect(isEmpty([])).toBe(true);
        expect(isEmpty({})).toBe(true);
        expect(isEmpty(true)).toBe(true);
    });

    it('should returns false for non-empty string, non-empty object, non-empty array, number', () => {
        expect(isEmpty('test')).toBe(false);
        expect(isEmpty({ key: 'value' })).toBe(false);
        expect(isEmpty([1, 2, 3])).toBe(false);
        expect(isEmpty(123)).toBe(true);
        expect(isEmpty(false)).toBe(true);
    });

    it('should set product to resolvedResponse of the promise when getResolvedProduct is called', async () => {
        const bpn: string = '12345';
        const promise = productResponseObject.getResolvedProduct(bpn);
        expect(productResponseObject.resolvedResponseByBpn[bpn]).toBeInstanceOf(Function);

        const product = mockProductsByBpnResponse.response.docs[0];
        productResponseObject.resolvedResponseByBpn[bpn](product);

        await expect(promise).resolves.toBe(product);
    });

    it('should return expected metadata if product detail is not available when getPDPMetaData called', async() => {
        const bpn: string = '12345';
        const metadata = getPDPMetaData(bpn, {}, '');

        const openGraph = {
            siteName: "safeway",
            type: "website",
            url: 'https://business-dev1.safeway.com/shop/product-details.12345.html'
        }

        expect(metadata.title).toBeUndefined();
        expect(metadata.description).toBeUndefined();
        expect(metadata.alternates?.canonical).toEqual('https://business-dev1.safeway.com/shop/product-details.12345.html');
        expect(metadata.openGraph).toEqual(openGraph);
    });
    it('should generate metadata with product detail if product detail is available when getPDPMetaData called', async() => {
        const product = mockProductsByBpnResponse.response.docs[0];
        const bpn: string = '12345';
        const metadata = getPDPMetaData(bpn, product, '');

        const description = `Shop ${product.name} from safeway. Browse our wide selection of ${product.shelfName} for Delivery or Drive Up & Go to pick up at the store!`
        const openGraph = {
            description: description,
            images: [{"url": "https://images.albertsons-media.com/is/image/ABS/12345?$ng-ecom-pdp-desktop$&defaultImage=Not_Available"}],
            siteName: "safeway",
            title: `${product.name} - safeway`,
            type: "website",
            url: 'https://business-dev1.safeway.com/shop/product-details.12345.html'
        }

        expect(metadata.title).toEqual(`${product.name} - safeway`);
        expect(metadata.description).toEqual(description);
        expect(metadata.alternates?.canonical).toEqual('https://business-dev1.safeway.com/shop/product-details.12345.html');
        expect(metadata.openGraph).toEqual(openGraph);
    });

    it('should generate metadata with product detail if product detail and multiple images are available when getPDPMetaData called', async() => {
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
        const bpn: string = '12345';
        const metadata = getPDPMetaData(bpn, product, '');

        const description = `Shop ${product.name} from safeway. Browse our wide selection of ${product.shelfName} for Delivery or Drive Up & Go to pick up at the store!`
        const openGraph = {
            description: description,
            images: [{"url": `https://images.albertsons-media.com/is/image/ABS/${images.items[0].image}?$ng-ecom-pdp-desktop$&defaultImage=Not_Available`}],
            siteName: "safeway",
            title: `${product.name} - safeway`,
            type: "website",
            url: 'https://business-dev1.safeway.com/shop/product-details.12345.html'
        }

        expect(metadata.title).toEqual(`${product.name} - safeway`);
        expect(metadata.description).toEqual(description);
        expect(metadata.alternates?.canonical).toEqual('https://business-dev1.safeway.com/shop/product-details.12345.html');
        expect(metadata.openGraph).toEqual(openGraph);
    });

    it('should return cache tag for product details page', () => {
        const url = 'https://safeway.com/product/details';
        const referer = 'https://safeway.com';
        const bpn = '12345';
        const banner = 'safeway';
        const env = 'dev';
        const expectedTag = 'p_dev_pdp,p_dev_safeway,p_dev_product-details.12345,p_dev_safeway_pdp';

        const result = getCacheTag(url, referer, bpn, banner, env);

        expect(result).toBe(expectedTag);
    });

    it('should return cache tag for marketplace page', () => {
        const url = 'https://safeway.com/product/details/marketplace';
        const referer = 'https://safeway.com';
        const bpn = '12345';
        const banner = 'safeway';
        const env = 'dev';
        const expectedTag = 'p_dev_pdp,p_dev_safeway,p_dev_product-details.12345,p_dev_safeway_pdp,p_dev_marketplace';

        const result = getCacheTag(url, referer, bpn, banner, env);

        expect(result).toBe(expectedTag);
    });

    it('should return cache tag for marketplace page with referer', () => {
        const url = 'https://safeway.com/product/details';
        const referer = 'https://safeway.com/product/details/marketplace';
        const bpn = '12345';
        const banner = 'safeway';
        const env = 'dev';
        const expectedTag = 'p_dev_pdp,p_dev_safeway,p_dev_product-details.12345,p_dev_safeway_pdp,p_dev_marketplace';

        const result = getCacheTag(url, referer, bpn, banner, env);

        expect(result).toBe(expectedTag);
    });

    it('should return cache tag for vine and cellar page', () => {
        const url = 'https://safeway.com/product/details/vineandcellar';
        const referer = 'https://safeway.com';
        const bpn = '12345';
        const banner = 'safeway';
        const env = 'dev';
        const expectedTag = 'p_dev_pdp,p_dev_safeway,p_dev_product-details.12345,p_dev_safeway_pdp,p_dev_vineandcellar';

        const result = getCacheTag(url, referer, bpn, banner, env);

        expect(result).toBe(expectedTag);
    });

    it('should return cache tag for vine and cellar page with referer', () => {
        const url = 'https://safeway.com/product/details';
        const referer = 'https://safeway.com/product/details/vineandcellar';
        const bpn = '12345';
        const banner = 'safeway';
        const env = 'dev';
        const expectedTag = 'p_dev_pdp,p_dev_safeway,p_dev_product-details.12345,p_dev_safeway_pdp,p_dev_vineandcellar';

        const result = getCacheTag(url, referer, bpn, banner, env);

        expect(result).toBe(expectedTag);
    });
})
