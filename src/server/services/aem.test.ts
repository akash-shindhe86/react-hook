import '@testing-library/jest-dom';
import api from '@/server/services/api';
import aemService from "@/server/services/aem";
import { headers } from 'next/headers';

jest.mock('./api');
jest.mock('next/headers', () => {
    return {
        headers: jest.fn()
    }
});

jest.mock('../config', () => {
    return {
        "B2C": {
            "dev": {
                baseDomainUrl: 'https://www-dev2.{banner}.com',
                aemVineHeaderUrl: "/content/experience-fragments/www/{banner}/en/generic_content/header-v3/header.content.wineshop.collapsed.html",
                aemMarketPlaceHeaderUrl: "/content/experience-fragments/www/{banner}/en/generic_content/header-v3/header.content.mkp.collapsed.html",
                aemHeaderUrl: "/content/experience-fragments/www/{banner}/en/generic_content/header-v3/header.content.html",
                checkSumUrl: "/bin/safeway/app-version",
                aemFooterUrl: "/content/experience-fragments/www/{banner}/en/generic_content/footer-v2/footer.content.html",
                aemVineFooterUrl: "/content/experience-fragments/www/{banner}/en/generic_content/footer-v2/footer.content.wineshop.html",
                aemMarketPlaceFooterUrl: "/content/experience-fragments/www/{banner}/en/generic_content/footer-v2/footer.content.mkp.html",
            }
        },
        "B2B": {
            "dev": {
                baseDomainUrl: 'https://business-dev2.{banner}.com',
                aemVineHeaderUrl: "/content/experience-fragments/www/{banner}/en/generic_content/header-v3/header.content.wineshop.collapsed.html",
                aemMarketPlaceHeaderUrl: "/content/experience-fragments/www/{banner}/en/generic_content/header-v3/header.content.mkp.collapsed.html",
                aemHeaderUrl: "/content/experience-fragments/www/{banner}/en/generic_content/header-v3/header.content.html",
                checkSumUrl: "/bin/safeway/app-version"
            }
        }
    }
});

describe('AEM service', () => {

    beforeEach(() => {
        headers.mockClear();
        jest.clearAllMocks();
    })

    it('should return promise when getOnLoadEvents function called', async () => {
        const  mockedAEMService = api as jest.MockedFunction<typeof api>;
        mockedAEMService.mockResolvedValue("<p>Mocked data</p>");
        const view = await aemService.getOnLoadEvents('/dummy_url');
        expect(view).toBe('<p>Mocked data</p>')
    });

    it('should return promise when getHeaderRender function called with localhost', async () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('localhost')
        })
        const  mockedAEMService = api as jest.MockedFunction<typeof api>;
        mockedAEMService.mockResolvedValue("<h1>Mocked data</h1>");
        const view = await aemService.getHeaderRender();
        expect(view).toBe('<h1>Mocked data</h1>')
    });

    it('should return promise when getFooterRender function called with safeway', async () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('safeway')
        })
        const  mockedAEMService = api as jest.MockedFunction<typeof api>;
        mockedAEMService.mockResolvedValue("<h1>Mocked data</h1>");
        const view = await aemService.getFooterRender();
        expect(view).toBe('<h1>Mocked data</h1>')
    });

   it('should return promise when getFooterRender function called with localhost', async () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('localhost')
        })
        const  mockedAEMService = api as jest.MockedFunction<typeof api>;
        mockedAEMService.mockResolvedValue("<h1>Mocked data</h1>");
        const view = await aemService.getFooterRender();
        expect(view).toBe('<h1>Mocked data</h1>')
    });

    it('should return the B2C config on B2C site', () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('www-dev2.safeway.com')
        })
        const config = aemService.getAEM().config;
        expect(config.baseDomainUrl).toBe('https://www-dev2.{banner}.com');
    });

    it('should return the B2B config on B2B site', () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('business-dev2.safeway.com')
        });
        const config = aemService.getAEM().config;
        expect(config.baseDomainUrl).toBe('https://business-dev2.{banner}.com');
    });

    xit('api should be called with aemVineheader selector for vineandcellar url', async () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('http://www-local-origin.safeway.com:3000/product/details/vineandcellar/960120624')
        })
        const mockedAEMService = api as jest.MockedFunction<typeof api>;
        mockedAEMService.mockResolvedValue({header:'123'});
        await aemService.getHeaderRender();
        expect(api).toHaveBeenCalledWith("https://www-dev2.safeway.com/bin/safeway/app-version", {"cache": "force-cache"})
        expect(api).toHaveBeenCalledWith("https://www-dev2.safeway.com/content/experience-fragments/www/safeway/en/generic_content/header-v3/header.content.wineshop.collapsed.html?version=123", {"cache": "force-cache"}, "text")
    });

    xit('api should be called with aemMarketplace selector for marketplace url', async () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('http://www-local-origin.safeway.com:3000/product/details/marketplace/960120624')
        })
        const mockedAEMService = api as jest.MockedFunction<typeof api>;
        mockedAEMService.mockResolvedValue({header:'123'});
        await aemService.getHeaderRender();
        expect(api).toHaveBeenCalledWith("https://www-dev2.safeway.com/bin/safeway/app-version", {"cache": "force-cache"})
        expect(api).toHaveBeenCalledWith("https://www-dev2.safeway.com/content/experience-fragments/www/safeway/en/generic_content/header-v3/header.content.mkp.collapsed.html?version=123", {"cache": "force-cache"}, "text")
    });

    xit('api should be called with aemHeaderselector for non marketplace and non vineandcellar url', async () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('http://www-local-origin.safeway.com:3000/product/details/960120624')
        })
        const mockedAEMService = api as jest.MockedFunction<typeof api>;
        mockedAEMService.mockResolvedValue({header:'123'});
        await aemService.getHeaderRender();
        expect(api).toHaveBeenCalledWith("https://www-dev2.safeway.com/bin/safeway/app-version", {"cache": "force-cache"})
        expect(api).toHaveBeenCalledWith( "https://www-dev2.safeway.com/content/experience-fragments/www/safeway/en/generic_content/header-v3/header.content.html?version=123", {"cache": "force-cache"}, "text")
    });

    it('api should be called with Vine AEM footer from config when programType is 1P_WINE', async () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('http://www-dev2.safeway.com:3000/product/details/vineandcellar/960120624')
        })
        const mockedAEMService = api as jest.MockedFunction<typeof api>;
        mockedAEMService.mockResolvedValue({footer:'123'});
        await aemService.getFooterRender('123');
        expect(api).toHaveBeenCalledWith("https://www-dev2.safeway.com/content/experience-fragments/www/safeway/en/generic_content/footer-v2/footer.content.wineshop.html?version=123", {"cache": "force-cache"}, "text")
    });

    it('api should be called with marketPlace AEM footer from config when programType is mkp', async () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('http://www-dev2.safeway.com:3000/product/details/marketplace/960120624')
        })
        const mockedAEMService = api as jest.MockedFunction<typeof api>;
        mockedAEMService.mockResolvedValue({footer:'123'});
        await aemService.getFooterRender('123');
        expect(api).toHaveBeenCalledWith("https://www-dev2.safeway.com/content/experience-fragments/www/safeway/en/generic_content/footer-v2/footer.content.mkp.html?version=123", {"cache": "force-cache"}, "text")
    });

    it('should returns dev environment for dev domains', () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('www-dev2.safeway.com')
        })
        const env = aemService.getEnvFromHost();
        expect(env).toBe('dev');
    });

    it('should returns qa1 environment if isAppEnv is true otherwise return qa for qa domains', () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('www-qa1.safeway.com')
        });

        const env = aemService.getEnvFromHost();
        expect(env).toBe('qa');

        const env1 = aemService.getEnvFromHost(true);
        expect(env1).toBe('qa1');

    });

    it('should returns qa2 environment if isAppEnv is true otherwise return acceptance for qa2 domains', () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('www-qa2.safeway.com')
        });

        const env = aemService.getEnvFromHost();
        expect(env).toBe('acceptance');

        const env1 = aemService.getEnvFromHost(true);
        expect(env1).toBe('qa2');

    });

    it('should returns qa3 environment if isAppEnv is true otherwise return perf for qa3 domains', () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('www-qa3.safeway.com')
        });

        const env = aemService.getEnvFromHost();
        expect(env).toBe('perf');

        const env1 = aemService.getEnvFromHost(true);
        expect(env1).toBe('qa3');

    });

    it('returns stage environment for stage domains', () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('www-stage.safeway.com')
        });
        const env = aemService.getEnvFromHost();
        expect(env).toBe('stage');
    });

    it('returns beta environment for beta domains', () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('www-beta.safeway.com')
        });
        const env = aemService.getEnvFromHost();
        expect(env).toBe('beta');
    });

    it('returns prod environment for other domains', () => {
        headers.mockReturnValue({
            get: jest.fn().mockReturnValue('www.safeway.com')
        });
        const env = aemService.getEnvFromHost();
        expect(env).toBe('prod');
    });

})
