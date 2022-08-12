import Request from './Request.js';
import Response from './Response.js';

export enum Method {
    CONNECT = 'CONNECT',
    DELETE = 'DELETE',
    GET = 'GET',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
    PATCH = 'PATCH',
    POST = 'POST',
    PUT = 'PUT',
    TRACE = 'TRACE',
}

export type RouteHandleCallback = (request: Request, response: Response) => void | Promise<void>;

