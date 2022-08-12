import Request from './Request.js';
import Response from './Response.js';
export declare enum Method {
    CONNECT = "CONNECT",
    DELETE = "DELETE",
    GET = "GET",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    PATCH = "PATCH",
    POST = "POST",
    PUT = "PUT",
    TRACE = "TRACE"
}
export declare type RouteHandleCallback = (request: Request, response: Response) => void | Promise<void>;
