import {ConstantType } from '@/types';

describe('Interfaces', () => {
    it('should allow object that matches the ConstantType interface', () => {
        const constantType: ConstantType = {
            BANNERS: ['123'],
            RESPONSE_TYPE_TEXT: '123',
            RESPONSE_TYPE_JSON: '123',
        }
        expect(constantType).toBeTruthy();
    });

    it('should allow object that matches the AppVersionType interface', () => {
        const appVersion = {
            header: '123',
            footer: '123',
        }
        expect(appVersion).toBeTruthy();
    });
})
