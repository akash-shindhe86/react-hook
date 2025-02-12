import api from '@/server/services/api';
import CONSTANTS from '@/constants';

describe('API call', () => {

    global.fetch = jest.fn();
    const mockedResponseData = 'mocked data';
    const mockedResponse = {
        json: jest.fn().mockResolvedValue({ data: mockedResponseData}),
        text: jest.fn().mockResolvedValue({ data: mockedResponseData}),
        ok: true
    };

    afterEach(() => {
        (global.fetch as jest.Mock).mockClear();
        jest.clearAllMocks();
    });

    it('should response success JSON response with the fetch call type JSON', async () => {
        (global.fetch as jest.Mock).mockResolvedValue(mockedResponse);
        const result = await api('dummyUrl', {}, CONSTANTS.RESPONSE_TYPE_JSON);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(result.data).toBe(mockedResponseData);
    });

    it('should response success TEXT response with the fetch call type TEXT', async () => {
        (global.fetch as jest.Mock).mockResolvedValue(mockedResponse);
        const result = await api('dummyUrl', {}, CONSTANTS.RESPONSE_TYPE_TEXT);

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(result.data).toBe(mockedResponseData);
    });

    it('should throw error when fetch API response is not ok', async () => {
        const mockedResponse = {
            json: jest.fn().mockResolvedValue({ data: mockedResponseData}),
            ok: false
        };
        (global.fetch as jest.Mock).mockResolvedValue(mockedResponse);
        await expect(api('dummyUrl')).rejects.toThrow('API response error' + JSON.stringify(mockedResponse));
    });

    it('should throw error with the fetch call', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Fetch error'));
        await expect(api('dummyUrl')).rejects.toThrow('Fetch error');
    });
})
