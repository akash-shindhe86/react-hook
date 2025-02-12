import React from 'react';
import { render, screen, act } from '@testing-library/react';
import withLazyLoad from './withLazyLoad';

const mockUnobserver = jest.fn();
// Mocking IntersectionObserver
class IntersectionObserverMock {
    constructor(callback: Function) {
        this.callback = callback;
        this.unobserve = mockUnobserver;
    }

    observe() {
        this.callback([{ isIntersecting: false }]);
    }

    unobserve() {}

    callback: Function;
}

function renderLazyLoad(observerMock: any) {
    Object.defineProperty(window, 'IntersectionObserver', {
        writable: true,
        value: observerMock,
    });
    const MockComponent = ({ text }: { text: string }) => <div>{text}</div>;
    const LazyLoadedComponent = withLazyLoad(MockComponent);
    return render(<LazyLoadedComponent text="Hello" />);
}

describe('withLazyLoad', () => {

    it('renders loading state initially', () => {
        renderLazyLoad(IntersectionObserverMock);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('does not render the wrapped component if not in the viewport', () => {
        renderLazyLoad(IntersectionObserverMock);
        expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    });

    it('renders the wrapped component when it is in the viewport', () => {
        class updatedIntersectionObserverMock extends IntersectionObserverMock {
            observe() {
                this.callback([{ isIntersecting: true }]);
            }
        }
        renderLazyLoad(updatedIntersectionObserverMock);
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getAllByText('Hello')).toHaveLength(1);
    });

    it('should call unobserve on unmount the component', () => {
        class updatedIntersectionObserverMock extends IntersectionObserverMock {
            observe() {
                this.callback([{ isIntersecting: true }]);
            }
        }

        const { unmount } = renderLazyLoad(updatedIntersectionObserverMock);
        expect(screen.getByText('Hello')).toBeInTheDocument();

        act(() => {
            unmount()
        })
        expect(mockUnobserver).toHaveBeenCalled()
    });
});
