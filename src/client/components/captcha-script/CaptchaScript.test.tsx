import { render, screen } from '@testing-library/react';
import CaptchaScript from './CaptchaScript';

jest.mock('html-react-parser', () => {
    return jest.fn().mockReturnValue(<p data-testid="parsed-script">Parse HTML</p>);
});

describe('CaptchaScript', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'location', {
            value: {
                href: 'https://example.com/shop/product-details.123456.html'
            },
            writable: true
        });
        document.head.innerText = 'document.__defineGetter__("referrer",function()';
    });

    test('renders hydration error script when conditions are met', () => {
        render(<CaptchaScript />);
        expect(screen.getByTestId('parsed-script')).toBeInTheDocument();
    });

    test('does not render captcha script when window.location.href does not include .html', () => {
        window.location.href = 'https://example.com/product/details/123456'
        render(<CaptchaScript />);
        expect(screen.queryByTestId('parsed-script')).not.toBeInTheDocument();
    });

    test('does not render captcha script when document.head.innerText does not include the specific string', () => {
        document.head.innerText = '';
        render(<CaptchaScript />);
        expect(screen.queryByTestId('parsed-script')).not.toBeInTheDocument();
    });
});
