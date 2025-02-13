jest.mock('wcax-containers-library/lib', () => ({
    ReviewsContainer: () => 'Mocked ReviewsContainer',
    PdpContainer: () => 'Mocked PdpContainer',
}));

import { ReviewsContainer, PdpContainer } from "./index";

describe('Client: Components Export', () => {
    it('should export ReviewsContainer', () => {
        expect(ReviewsContainer).toBeDefined();
        expect(ReviewsContainer()).toBe('Mocked ReviewsContainer')
    });

    it('should export PdpContainer', () => {
        expect(PdpContainer).toBeDefined();
        expect(PdpContainer()).toBe('Mocked PdpContainer')
    });
})
