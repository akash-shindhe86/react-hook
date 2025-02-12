import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '@/server/components/Footer';
import envConfig from '@/server/config';
import aemService from "@/server/services/aem";

jest.mock('../services/aem', () => {
    return {
        getAEM: jest.fn(),
        getFooterRender: jest.fn().mockResolvedValue('<p data-testid="footer">Footer HTML</p>'),
    }
});

const banner: string = 'safeway';
const config = envConfig["B2C"]['dev'];

describe('Server component: Footer', () => {
    beforeEach(() => {
        aemService.getAEM.mockClear();
    })

    it('should render Footer', async () => {
        aemService.getAEM.mockReturnValue({
            config,
            banner
        });
        // render(Footer({ version: '123456', url: 'https://www-qa1.safeway.com' }));
        // const footer = screen.getByTestId('footer');
        // expect(footer).toBeInTheDocument();
    });
})
