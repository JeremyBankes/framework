import http from 'http';
import ServerApplication from './ServerApplication.js';

export type Headers = { [key: string]: string | string[] };

export default class Request {

    private _application: ServerApplication;
    private _handle: http.IncomingMessage;

    public constructor(application: ServerApplication, handle: http.IncomingMessage) {
        this._application = application;
        this._handle = handle;
    }

    public get method() {
        return this._handle.method;
    }

    public get path() {
        return this._handle.url;
    }

    public get address() {
        return this._handle.socket.remoteAddress;
    }

    public get port() {
        return this._handle.socket.remotePort;
    }

    public get headers(): Headers {
        return this._handle.headers;
    }

}
