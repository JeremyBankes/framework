import http from 'http';
import ServerApplication from './ServerApplication.js';

export default class Request {

    private _application: ServerApplication;
    private _handle: http.IncomingMessage;

    public constructor(application: ServerApplication, handle: http.IncomingMessage) {
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
