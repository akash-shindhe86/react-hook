import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/server/components/Header';

jest.mock('../services/aem', () => {
    return {
        getHeaderRender: jest.fn().mockResolvedValue('<p data-testid="header">Header HTML</p>')
    }
});

describe('Server component: Header', () => {
    it('should import all the required script', async () => {
        render(await Header({ version: '123456' }));
        const header = screen.getByTestId('header');
        expect(header).toBeInTheDocument();
    });
})
