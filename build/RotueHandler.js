export default class RouteHandler {
    _path;
    _method;
    _handleCallback;
    constructor(path, method, handleCallback = null) {
        this._path = path;
        this._method = method;
        this._handleCallback = handleCallback;
    }
    get path() { return this._path; }
    get method() { return this._method; }
    handle(request, response) {
        if (this._handleCallback !== null) {
            return this._handleCallback(request, response);
        }
    }
}
