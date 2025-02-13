import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Head from '@/server/components/Head';
import aemService from '@/server/services/aem';
import { replaceBanner } from "@/server/services/utils";
import envConfig from '@/server/config';

jest.mock('../services/aem', () => {
    return {
        getAEM: jest.fn(),
        getOnLoadEvents: jest.fn().mockResolvedValue('<script src="http://www.example.com"></script>')
    }
});

const banner: string = 'safeway';
const config = envConfig["B2C"]['dev'];

describe('Server component: Head', () => {

    beforeEach(() => {
        aemService.getAEM.mockClear();
    })

    it('should import all the required script', () => {
        aemService.getAEM.mockReturnValue({
            config,
            banner
        })
        const onloadEventHtml = '';
        render(Head({ onloadEventHtml }));
        expect(screen.getByTestId('jqueryjs')).toHaveAttribute('src', replaceBanner(config.baseDomainUrl+config.jQuery, banner));
        expect(screen.getByTestId('on-loadjs')).toHaveAttribute('src', replaceBanner(config.baseDomainUrl+config.siteOnLoadJS, banner));
        expect(screen.getByTestId('analytics')).toHaveAttribute('src', config.analyticsUrl);
    });

    it('should renders Head with onloadEventHtml', () => {
        const onloadEventHtml = '<script data-testid="onload-script" src="http://www.example.com"></script>';
        render(<Head onloadEventHtml={onloadEventHtml} />);
        expect(screen.getByTestId('onload-script')).toBeInTheDocument();
    });
})
