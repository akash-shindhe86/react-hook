import React from 'react';
import Cookies from 'js-cookie'
import { render, screen, waitFor } from '@testing-library/react';
import EnhanceContent, { items, loadEnhancedContentFromSyndigo, showEnhancedContent, loadEnhancedContentFromSalsify } from './EnhanceContent';

jest.mock('../lazy-load/withLazyLoad', () =>{
    return {
        __esModule: true,
        default: (Component: any) => Component,
    }
})

jest.mock('./signifyd.min', () =>{
    return {
        __esModule: true,
        default: (Component: any) => Component,
    }
})

const mockConfig = {
    salsifyClientId: 'mockClientId',
    salsifyContentIdType: 'mockContentIdType',
    enhanceContentCookieList: ['cookie1', 'cookie2'],
};
const bpn = '123456';
let deleteCookieMock;
describe('Component: EnhanceContent', () => {
    beforeEach(() => {
        window.SYNDI = [];
        window.SWY = {};
        window.dataLayer = null;
        deleteCookieMock = jest.spyOn(Cookies, 'remove');
    })

    afterEach(() => {
        deleteCookieMock.mockRestore();
    });

    it('should render EnhanceContent with correct props', () => {
        const { container } = render(<EnhanceContent config={mockConfig} bpn={bpn} />);
        expect(container).toBeInTheDocument();
    });

    it('should loads enhanced content when C003 is part of oneTrustLoadedEvent in dataLayer', async () => {
        window.dataLayer = [{ event: 'OneTrustGroupsUpdated', OnetrustActiveGroups: ['C0003'] }];
        render(<EnhanceContent config={mockConfig} bpn={bpn} />);

        // Wait for any asynchronous tasks to complete
        await waitFor(() => {
            expect(window.SYNDI.includes(bpn)).toBeTruthy();
        });
    });

    it('should loads enhanced content when C003 is not part of oneTrustLoadedEvent in dataLayer', async () => {
        window.dataLayer = [{ event: 'OneTrustGroupsUpdated', OnetrustActiveGroups: [] }];
        render(<EnhanceContent config={mockConfig} bpn={bpn} />);

        // Wait for any asynchronous tasks to complete
        await waitFor(() => {
            expect(window.SYNDI.includes(bpn)).toBeTruthy();
            expect(deleteCookieMock).toHaveBeenCalledWith('cookie1', { domain: 'localhost' });
        });
    });

    it('should load enhanced content when oneTrustLoadedEvent event is dispatched without C003', async () => {
        render(<EnhanceContent config={mockConfig} bpn={bpn} />);

        // Wait for any asynchronous tasks to complete
        await waitFor(() => {
            window.dispatchEvent(new CustomEvent('OneTrustGroupsUpdated'))
            expect(window.SYNDI.includes(bpn)).toBeTruthy();
            expect(deleteCookieMock).toHaveBeenCalled();
        });
    });

    it('should load enhanced content when oneTrustLoadedEvent event is dispatched with C003', async () => {
        render(<EnhanceContent config={mockConfig} bpn={bpn} />);

        // Wait for any asynchronous tasks to complete
        await waitFor(() => {
            window.dispatchEvent(new CustomEvent('OneTrustGroupsUpdated', { detail: "C0003" }))
            expect(window.SYNDI.includes(bpn)).toBeTruthy();
            expect(deleteCookieMock).not.toHaveBeenCalled();
        });
    });

    it('should render content when called showEnhancedContent', async () => {
        const contentBlock = document.createElement('div')
        contentBlock.className = 'enhanced-content d-none';
        document.body.appendChild(contentBlock);

        const contentDetailBlock = document.createElement('div')
        contentDetailBlock.className = 'enhanced-content__container d-none';
        document.body.appendChild(contentDetailBlock);

        showEnhancedContent();
        expect(contentBlock.classList.contains(items.dNoneClass)).toBeFalsy();
    });

    it('should call syndigo sdk', () => {
        const showEnhancedContentMock = jest.fn();
        loadEnhancedContentFromSyndigo(jest.fn(), showEnhancedContentMock, bpn, jest.fn());

        window.SYNDI[0].contentCallback(true);
        expect(showEnhancedContentMock).toHaveBeenCalled()
    });

    it('should call salsify sdk', () => {
        const fallbackMock = jest.fn();
        loadEnhancedContentFromSyndigo(fallbackMock, jest.fn(), bpn, jest.fn());

        window.SYNDI[0].contentCallback(false);
        expect(fallbackMock).toHaveBeenCalled()
    });

    it('should call loadSyndigoScript when loadEnhancedContentFromSyndigo is called', () => {
        const loadSyndigoScript = jest.fn();
        loadEnhancedContentFromSyndigo(jest.fn(), jest.fn(), bpn, loadSyndigoScript);
        expect(loadSyndigoScript).toHaveBeenCalled()
    });

    it('should call loadSalsifyScript when loadEnhancedContentFromSalsify is called', () => {
        const loadSalsifyScript = jest.fn();
        loadEnhancedContentFromSalsify(false, mockConfig, bpn, loadSalsifyScript);
        expect(loadSalsifyScript).toHaveBeenCalled()
    });

});
