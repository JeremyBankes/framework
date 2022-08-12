import Request from './Request.js';
import Response from './Response.js';
import { Method, RouteHandleCallback } from './types.js';
export default class RouteHandler {
    private _path;
    private _method;
    private _handleCallback;
    constructor(path: string, method: Method, handleCallback?: RouteHandleCallback);
    get path(): string;
    get method(): Method;
    handle(request: Request, response: Response): void | Promise<void>;
}
