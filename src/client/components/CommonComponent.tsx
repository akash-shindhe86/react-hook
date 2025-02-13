'use client';
import * as React from 'react';
import { useEffect } from 'react';

const selectors = {
    linkBlockContent: '#linkblock-placeholder',
    linkBlockPlaceHolder: '#linkblock-content',
    linkBlockStaticClass: 'linkblock-container--static',
}

const moveContentToPlaceHolder = () => {
    const contentBlock = document.querySelector(selectors.linkBlockContent);

    const mktContentRepositioned = document.querySelector(selectors.linkBlockPlaceHolder);

    if (contentBlock && mktContentRepositioned) {
        if (contentBlock.parentNode) {
            mktContentRepositioned.classList.add(selectors.linkBlockStaticClass);
            contentBlock.insertBefore(mktContentRepositioned, contentBlock.nextSibling);
        }
    }
}
const addScriptToDom = (className: string, src: string, onLoad?: any, onError?: any) => {
    // Get all elements with the specified class
    const elements = document.getElementsByClassName(className)

    // Create a script tag
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = onLoad;
    script.onerror = onError;

    // Append the script tag to the first element
    elements[0].appendChild(script);

}
const CommonComponent = ({configObj, config}: {configObj?: any, config? :any}) => {

    useEffect(() => {
        if (configObj?.pageType === 'pdp') {
            moveContentToPlaceHolder();
            // @ts-ignore
            addScriptToDom('App-footer', 'https://pagead2.googlesyndication.com/tag/js/gpt.js', () => gamScriptLoaded(true), () => gamScriptLoaded(false));
        }
        // script to load blue triangle
        addScriptToDom('App-footer', config?.blueTriangleUrl);
    }, []);
    return (<></>)
}

export default CommonComponent;
