export default class Request {
    _application;
    _handle;
    constructor(application, handle) {
        this._application = application;
        this._handle = handle;
    }
    get method() {
        return this._handle.method;
    }
    get path() {
        return this._handle.url;
    }
    get address() {
        return this._handle.socket.remoteAddress;
    }
    get port() {
        return this._handle.socket.remotePort;
    }
    get headers() {
        return this._handle.headers;
    }
}
