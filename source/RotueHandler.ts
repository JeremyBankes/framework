import Request from './Request.js';
import Response from './Response.js';
import { Method, RouteHandleCallback } from './types.js';

export default class RouteHandler {

    private _path: string;
    private _method: Method;
    private _handleCallback: RouteHandleCallback;

    constructor(path: string, method: Method, handleCallback: RouteHandleCallback = null) {
        this._path = path;
        this._method = method;
        this._handleCallback = handleCallback;
    }

    public get path() { return this._path; }
    public get method() { return this._method; }

    public handle(request: Request, response: Response) {
        if (this._handleCallback !== null) {
            return this._handleCallback(request, response);
        }
    }

}