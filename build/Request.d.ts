/// <reference types="node" />
import http from 'http';
import ServerApplication from './ServerApplication.js';
export declare type Headers = {
    [key: string]: string | string[];
};
export default class Request {
    private _application;
    private _handle;
    constructor(application: ServerApplication, handle: http.IncomingMessage);
    get method(): string;
    get path(): string;
    get address(): string;
    get port(): number;
    get headers(): Headers;
}
