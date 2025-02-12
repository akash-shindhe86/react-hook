import CONSTANTS from "@/constants";

describe('Constants', () => {

    it('should have the correct RESPONSE_TYPE_TEXT', () => {
        expect(CONSTANTS.RESPONSE_TYPE_TEXT).toBe('text');
    });

    it('should have the correct BANNERS length', () => {
        expect(CONSTANTS.BANNERS.length).toBe(15);
    });

    it('should have the correct safeway in BANNERS', () => {
        expect(CONSTANTS.BANNERS).toContain('safeway');
    });

})
