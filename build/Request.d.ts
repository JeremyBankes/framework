/// <reference types="node" />
import http from 'http';
import ServerApplication from './ServerApplication.js';
export default class Request {
    private _application;
    private _handle;
    constructor(application: ServerApplication, handle: http.IncomingMessage);
    get method(): string;
    get path(): string;
}
