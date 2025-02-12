import { apiOptionsType } from "@/server/services/types";
import CONSTANTS from "@/constants";
import logger from '@/logger/logger';

const api = async (url: string, options: apiOptionsType = {}, responseType: string = CONSTANTS.RESPONSE_TYPE_JSON): Promise<any> => {
    try {
        const response: Response = await fetch(url, options as object);
        if(!response.ok) {
            logger.error('API response error' + JSON.stringify(response) + url);
            throw new Error('API response error' + JSON.stringify(response));
        }
        logger.debug("api.ts - api() - SUCCESS: " + url);
        return responseType === CONSTANTS.RESPONSE_TYPE_TEXT ? await response.text(): await response.json();
    } catch (error) {
        logger.error('API Failed or parse error ' + error + url);
        throw error;
    }
}

export default api;
