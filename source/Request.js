export default class Request {
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
}
