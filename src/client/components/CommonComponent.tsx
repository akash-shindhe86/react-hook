'use client';
import * as React from 'react';
import { useEffect } from 'react';

const selectors = {
    linkBlockContent: '#linkblock-placeholder',
    linkBlockPlaceHolder: '#linkblock-content',
    linkBlockStaticClass: 'linkblock-container--static',
};

const moveContentToPlaceHolder = () => {
    const contentBlock = document.querySelector(selectors.linkBlockContent);
    const mktContentRepositioned = document.querySelector(selectors.linkBlockPlaceHolder);

    if (contentBlock && mktContentRepositioned) {
        if (contentBlock.parentNode) {
            mktContentRepositioned.classList.add(selectors.linkBlockStaticClass);
            contentBlock.insertBefore(mktContentRepositioned, contentBlock.nextSibling);
        }
    }
};

const addScriptToDom = (className: string, src: string, onLoad?: any, onError?: any) => {
    const elements = document.getElementsByClassName(className);

    if (elements.length > 0) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = onLoad;
        script.onerror = onError;

        elements[0].appendChild(script);
    }
};

const CommonComponent = ({ configObj, config }: { configObj?: any, config?: any }) => {
    useEffect(() => {
        if (configObj?.pageType === 'pdp') {
            moveContentToPlaceHolder();
            addScriptToDom('App-footer', 'https://pagead2.googlesyndication.com/tag/js/gpt.js', () => gamScriptLoaded(true), () => gamScriptLoaded(false));
        }
        addScriptToDom('App-footer', config?.blueTriangleUrl);
    }, []);

    return (<></>);
};

export default CommonComponent;