import { render, screen, waitFor } from '@testing-library/react';
import RootLayout from '@/app/layout'

jest.mock('../server/components/Head', () => {
    const Head = () => <head></head>;
    return Head;
});

jest.mock('../server/components/Header', () => {
    const Header = () => <div />;
    return Header;
});

jest.mock('../server/components/Footer', () => {
    const Footer = () => <div />;
    return Footer;
});

jest.mock('../client/components/index', () => {
    const RouteProvider = ({ children }: { children: any}) => <div data-testid="app-route-provider">{children}</div>
    return {
        RouteProvider
    };
});

jest.mock('../server/services/aem', () => {
    return {
        getAEM: jest.fn().mockReturnValue({
            banner: 'safeway',
            config: {
                baseDomainUrl: 'www-qa1.safeway.com',
                aemOnLoadEventHTML: '/home.on-load-event.html'
            },
        }),
        getEnvFromHost: jest.fn().mockReturnValue('qa1'),
        getOnLoadEvents: jest.fn().mockResolvedValue('<script src="http://www.example.com"></script>'),
        getCheckSum: jest.fn().mockResolvedValue({ header: '1.0.0', footer: '1.0.0' })
    }
});

jest.mock('next/headers', () => {
    return {
        headers: () => {
            return {
                get: jest.fn(),
            }
        },
    }
})

describe('MyLayout', () => {
    it('renders the footnote', async () => {
        render(await RootLayout({ children: <div data-testid="children">Children</div> }));
        expect(screen.getByTestId('children')).toBeInTheDocument();
        waitFor(() => expect(screen.getAllByTestId("app-route-provider")).toBeInTheDocument());
    });
});
