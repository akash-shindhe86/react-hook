import * as React from 'react';
import { render } from '@testing-library/react';
import CommonComponent from './CommonComponent';

const config = {blueTriangleUrl: "https://albertsons26741zTest.btttag.com/btt.js"};

describe('Component CommonComponent', () => {
    it('should set componentsLoaded to true in useEffect hook', () => {
        const mockDocumentQuerySelector = jest.spyOn(document, 'querySelector').mockReturnValueOnce(true);
        window.gamScriptLoaded = jest.fn();
        const configObj = { programType: 'abs', pageType: 'pdp'}
        render(<div className = 'App-footer'><CommonComponent configObj={configObj} config = {config}/></div>);

        expect(mockDocumentQuerySelector).toHaveBeenCalledTimes(2);
        expect(mockDocumentQuerySelector).toHaveBeenNthCalledWith(1, '#linkblock-placeholder');
        expect(mockDocumentQuerySelector).toHaveBeenNthCalledWith(2, '#linkblock-content');
    });

    it('should query for the copyBlock element in the if statement', () => {
        const mockDocumentQuerySelector = jest.spyOn(document, 'querySelector').mockReturnValueOnce(true);
        window.gamScriptLoaded = jest.fn();
        const configObj = { programType: 'abs', pageType: 'pdp'}
        render(<div className = 'App-footer'><CommonComponent configObj={configObj} config = {config}/></div>);

        expect(mockDocumentQuerySelector).toHaveBeenCalledTimes(4);
    });

});
