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

    // Combine headers and credentials
    const options: AxiosRequestConfig = {
        method,
        url: queryParams ? `${url}?${queryString.stringify(queryParams)}` : url,
        data: body || null,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        withCredentials: useCredentials, // Automatically handles cookies if true
        ...nextOption,
    };

    try {
        const response = await axios.request<T>(options);
        return response.data; // Automatically parsed
    } catch (error: any) {
        // Handle errors and return custom error structure
        if (error.response) {
            const { status, data } = error.response;
            return {
                statusCode: status,
                message: data?.message || "",
                error: data?.error || "",
            } as T;
        } else {
            throw new Error(error.message);
        }
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

    const options: AxiosRequestConfig = {
        method,
        url: queryParams ? `${url}?${queryString.stringify(queryParams)}` : url,
        data: body || null,
        headers: {
            ...headers, // No default content type for file uploads
        },
        withCredentials: useCredentials,
        ...nextOption,
    };

    try {
        const response = await axios.request<T>(options);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            const { status, data } = error.response;
            return {
                statusCode: status,
                message: data?.message || "",
                error: data?.error || "",
            } as T;
        } else {
            throw new Error(error.message);
        }
    }
};
