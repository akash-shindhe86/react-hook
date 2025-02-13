'use client';

import React, { ComponentType, useEffect, useRef, useState } from 'react';
const withLazyLoad = <P extends object>(
    WrappedComponent: ComponentType<P>,
    threshold = 0.5
): React.FC<P> => {
    return (props: P) => {
        const ref = useRef<HTMLDivElement>(null);
        const [hasLoaded, setHasLoaded] = useState(false);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !hasLoaded) {
                        setHasLoaded(true);
                    }
                },
                { threshold }
            );

            const element = ref.current;
            if (element) {
                observer.observe(element);
            }

            return () => {
                if (element) {
                    observer.unobserve(element);
                }
            };
        }, []);

        return (
            <div ref={ref}>
                {hasLoaded ? <WrappedComponent {...props} /> : <div>Loading...</div>}
            </div>
        );
    };
};
export default withLazyLoad;
