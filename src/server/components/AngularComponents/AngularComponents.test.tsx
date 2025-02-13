import {render} from "@testing-library/react";
import AngularComponents, {getBanner} from "./AngularComponents";
import aemService from "../../../server/services/aem";

const config = {
    apimBasePath: "/abs/qapub",
    mealSubcriptionKey: '77bac18b40f04e50aabc7c29d90bf3e2'
};

jest.mock('../../../server/services/aem');

describe('getBanner', () => {
    it('should return the banner from AEM service', () => {
        const mockBanner = { banner: "safeway"};
        (aemService.getAEM as jest.Mock).mockReturnValue({ banner: mockBanner });

        const result = getBanner();

        expect(result).toEqual(mockBanner); 
        expect(aemService.getAEM).toHaveBeenCalled(); 
    });
});

describe("LazyWrapper Component", () => {
    beforeEach(() => {
        global.Promise = { resolve: jest.fn().mockReturnValue({ idOfShelf: "1_29_1_3" }) } as unknown as PromiseConstructor;
    });

    it("renders the LazyWrapper component", async () => {
        const { container } = render(await AngularComponents( {config: config, componentType: "angularComp"}));
        expect(container).toBeInTheDocument();
    });

    it("should render most popular and featured item prdouct carousels on abs PDP", async () => {
        const configObj = {
            programType: 'abs'
        };
        const productResponsePromise = jest.fn();
        const {container} = render(await AngularComponents( {config: config, configObj: configObj, componentType: "angularComp", productResponsePromise}));
        const lazyWrappers = container.querySelectorAll(".master-product-carousel");
        expect(lazyWrappers.length).toBe(2);

        lazyWrappers.forEach((wrapper) => {
            const carousel: any = wrapper.querySelector("lazy-wrapper");
            expect(carousel.getAttribute("data-lazy-component")).toBe("product-carousel");
            expect(["Similar Items", "Featured Items"]).toContain(carousel.getAttribute("data-carousel-title"));
            expect(carousel.getAttribute("data-carousel-type")).toBe("apidriven");
            expect(carousel.getAttribute("data-carousel-users")).toBe("false");
            expect(carousel.getAttribute("data-carousel-action")).toBe("qty-stepper");
            expect(carousel.getAttribute("data-carousel-api") == config.apimBasePath);
            expect(carousel.getAttribute("data-carousel-api-post")).toBe("1_");
            expect(carousel.getAttribute("data-include-offer")).toBe("true");
            expect(carousel.getAttribute("data-navigation-type")).toBe("page-by-page");
            expect(["true", "false"]).toContain(carousel.getAttribute("data-carousel-pdp"));
            expect(["12", "14"]).toContain(carousel.getAttribute("data-carousel-max-products"));
        });
    });

    it("should not render most popular product carousels on B2B PDP", async () => {
        const configObj = {
            programType: '1P_B2B'
        };
        const {container} = render(await AngularComponents( {config: config, configObj: configObj, componentType: "angularComp"}));
        const lazyWrappers = container.querySelectorAll(".master-product-carousel");
        lazyWrappers.forEach((wrapper) => {
            const carousel: any = wrapper.querySelector("lazy-wrapper");
            expect(carousel.getAttribute("data-lazy-component")).toBe("product-carousel");
            expect(["Similar Items"]).not.toContain(carousel.getAttribute("data-carousel-title"));
        });
    });

    it("should render feature item product carousels on B2B PDP", async () => {
        const configObj = {
            programType: '1P_B2B'
        };
        const {container} = render(await AngularComponents( {config: config, configObj: configObj, componentType: "angularComp"}));
        const lazyWrappers = container.querySelectorAll(".master-product-carousel");
        lazyWrappers.forEach((wrapper) => {
            const carousel: any = wrapper.querySelector("lazy-wrapper");
            expect(carousel.getAttribute("data-lazy-component")).toBe("product-carousel");
            expect(["Featured Items"]).toContain(carousel.getAttribute("data-carousel-title"));
        });
    });

    it("should render product carousels on neither 1P nor B2B PDP", async () => {
        const productResponsePromise = jest.fn();
        const {container} = render(await AngularComponents( {config: config, componentType: "angularComp", productResponsePromise}));
        const lazyWrappers = container.querySelectorAll(".master-product-carousel");
        expect(lazyWrappers.length).toBe(2);
    });

    it("should render meals carousels Lazy Wrapper component with default props on 1P PDP", async () => {
        const configObj = {
            programType: 'abs'
        };
        const {container} = render(await AngularComponents( {config: config, configObj: configObj, componentType: "angularComp"}));
        const lazyWrapper: any = container.querySelector(".slick-meal-carousel lazy-wrapper");
        expect(lazyWrapper.getAttribute("data-lazy-component")).toBe("meal-carousel");
        expect(lazyWrapper.getAttribute("data-carousel-title")).toBe("Try these recipes");
        expect(lazyWrapper.getAttribute("data-carousel-page")).toBe("productPage");
        expect(lazyWrapper.getAttribute("data-carousel-render")).toBe("clientSide");
        expect(lazyWrapper.getAttribute("data-carousel-max-recipes")).toBe("12");
        expect(lazyWrapper.getAttribute("data-carousel-api") == config.apimBasePath);
        expect(lazyWrapper.getAttribute("data-carousel-subscription-key") == config.mealSubcriptionKey);
    });

    it("should render meals carousels Lazy Wrapper component with default props on B2B PDP", async () => {
        const configObj = {
            programType: '1P_B2B'
        };
        const {container} = render(await AngularComponents( {config: config, configObj: configObj, componentType: "angularComp"}));
        const lazyWrapper: any = container.querySelector(".slick-meal-carousel lazy-wrapper");
        expect(lazyWrapper.getAttribute("data-lazy-component")).toBe("meal-carousel");
        expect(lazyWrapper.getAttribute("data-carousel-title")).toBe("Try these recipes");
        expect(lazyWrapper.getAttribute("data-carousel-page")).toBe("productPage");
        expect(lazyWrapper.getAttribute("data-carousel-render")).toBe("clientSide");
        expect(lazyWrapper.getAttribute("data-carousel-max-recipes")).toBe("12");
        expect(lazyWrapper.getAttribute("data-carousel-api") == config.apimBasePath);
        expect(lazyWrapper.getAttribute("data-carousel-subscription-key") == config.mealSubcriptionKey);
    });

    it("should not render meals carousels Lazy Wrapper component with default props on neither abs nor B2B PDP", async () => {
        const {container} = render(await AngularComponents( {config: config, componentType: "angularComp"}));
        const lazyWrapper: any = container.querySelector(".slick-meal-carousel lazy-wrapper");
        expect(lazyWrapper).not.toBeNull();
    });

    it("should render ultra skinny banner html when componentType is 'ultraSkinnyBanner' on other than B2B PDP", async () => {
        const {container} = render(await AngularComponents( {config: config, componentType: "ultraSkinnyBanner"}));
        const bannerElement = container.querySelector('.google-adManager--UltraSkinnyBanner');
        const scriptElement = container.querySelector('script');
        expect(bannerElement).toBeInTheDocument();
        expect(scriptElement).toBeInTheDocument();
    });

    it("should not render ultra skinny banner on B2B PDP", async () => {
        const configObj = {
            programType: '1P_B2B'
        };
        const { container } = render(await AngularComponents( {config: config, configObj: configObj, componentType: "ultraSkinnyBanner"}));
        const bannerElement = container.querySelector('.google-adManager--UltraSkinnyBanner');
        expect(bannerElement).toBeNull();
    });

    it("should render non endemic banner html when componentType is 'nonEndemicBanner' on other than B2B PDP", async () => {
        const { container } = render(await AngularComponents( {config: config, componentType: "nonEndemicBanner"}));
        const bannerElement = container.querySelector('.google-adManager--NonEndemicBanner.full-width-80pxtop-horizontal-line.full-width-center-banner-80pxtop-20pxbottom');
        const scriptElement = container.querySelector('script');
        expect(bannerElement).toBeInTheDocument();
        expect(scriptElement).toBeInTheDocument();
    });

    it("should not render non endemic banner on B2B PDP", async () => {
        const configObj = {
            programType: '1P_B2B'
        };
        const { container } = render(await AngularComponents( {config: config, configObj: configObj, componentType: "nonEndemicBanner"}));
        const bannerElement = container.querySelector('.google-adManager--NonEndemicBanner.full-width-80pxtop-horizontal-line.full-width-center-banner-80pxtop-20pxbottom');
        expect(bannerElement).toBeNull();
    });

    it("should render coupon carousel html when componentType is 'couponsCarousel'", async () => {
        const { container } = render(await AngularComponents( {config: config, componentType: "couponsCarousel"}));
        const couponCarouselElement = container.querySelector('lazy-wrapper[data-lazy-component="coupon-carousel"]');
        expect(couponCarouselElement).toBeInTheDocument();
    });
});


