import axios, { AxiosRequestConfig } from 'axios';
import queryString from 'query-string';

export const sendRequest = async <T>(props: IRequest): Promise<T> => {
    const {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;

    // Setting up axios config
    const config: AxiosRequestConfig = {
        method: method,
        headers: { 'Content-Type': 'application/json', ...headers },
        params: queryParams, // automatically handles query params
        withCredentials: useCredentials,
        ...nextOption
    };

    if (body) {
        config.data = body;
    }

    try {
        const response = await axios(url, config);
        return response.data as T;
    } catch (error: any) {
        const errResponse = error.response;
        return {
            statusCode: errResponse?.status,
            message: errResponse?.data?.message ?? '',
            error: errResponse?.data?.error ?? ''
        } as T;
    }
};

export const sendRequestFile = async <T>(props: IRequest): Promise<T> => {
    const {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;
    // Setting up axios config for file upload
    const config: AxiosRequestConfig = {
        method: method,
        headers: { ...headers },
        params: queryParams, // automatically handles query params
        withCredentials: useCredentials,
        ...nextOption
    };
    if (body) {
        config.data = body; // For files, body should be FormData or similar
    }
    try {
        const response = await axios(url, config);
        return response.data as T;
    } catch (error: any) {
        const errResponse = error.response;
        return {
            statusCode: errResponse?.status,
            message: errResponse?.data?.message ?? '',
            error: errResponse?.data?.error ?? ''
        } as T;
    }
};
