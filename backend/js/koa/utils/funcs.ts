import { AxiosError } from "axios";

import { ERROR_CODES } from "./const.js";
import { ErrorMessage, ResponseMessage } from "./types.js";


export function generateRandomString(length: number) {
    //TODO: ENSURE ONLY UNIQUE VALUES GENERATED
    const POSSIBLE = "abcdef0123456789";
    let text = '';
  
    for (let i = 0; i < length; i++) {
        text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE.length));
    };

    return text;
};


export function wrapResponse(error: ErrorMessage, res_data: any) {
    
    return {
        error: {...error},
        data: res_data
    };
};


export function formatAxiosError(error_obj: AxiosError) {
    const REQUEST_CONFIG = {
        url: `${error_obj.config?.baseURL} ${error_obj.config?.url}`,
        responseType: error_obj.config?.responseType?.toUpperCase(),
        method: error_obj.config?.method?.toUpperCase(),
        params: error_obj.config?.params
    };

    if (error_obj.response) {

        return {
            code: error_obj.response.status,
            error: ERROR_CODES.get(error_obj.response.status),
            //@ts-ignore //TODO: FIGURE THIS OUT!
            details: `${JSON.stringify({message: error_obj.response.data?.error.message.toLowerCase(), ...REQUEST_CONFIG})}`
        };
    } else if (error_obj.request) {

        return {
            code: 500,
            error: ERROR_CODES.get(500),
            details: `${JSON.stringify({...error_obj.request, ...REQUEST_CONFIG})}`
        };
    } else {

        return {
            code: error_obj.status,
            error: ERROR_CODES.get(error_obj.status ?? 500),
            details: `${JSON.stringify({name: error_obj.name, message: error_obj.message, ...REQUEST_CONFIG})}`
        };
    }

};


export function checkEnvironment() { //* check if server is running in some form of production environment

    return !["production", "prod", "development", "dev"].includes(process.env.NODE_ENV || "prod");
};