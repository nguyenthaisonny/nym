export { };
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }


    interface UserResLogin {
        _id: string;
        name: string;
        email: string;
    }
    interface UserResRegister {
        _id: string;
        name: string;
        email: string;
    }
    interface ILogin {
        user: UserResLogin
        access_token: string
    }

    interface IRegister {
        user: UserResRegister
        access_token: string
    }

    interface ResendCodeRes {
        user: {
            _id: string
            codeId: string
        }
    }
}

