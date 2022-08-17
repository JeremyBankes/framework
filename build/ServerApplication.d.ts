import RouteHandler from './RotueHandler.js';
import { Method, RouteHandleCallback } from './types.js';
interface ServerApplicationOptions {
    protocol?: string;
    host?: string;
    port?: number;
    ssl?: {
        key: string;
        certificate: string;
    };
    allowOrigins?: string[];
    static?: string;
}
export default class ServerApplication {
    mimeTypes: {
        [key: string]: string;
    };
    private _server;
    private _protocol;
    private _host;
    private _port;
    private _key;
    private _certificate;
    private _allowOrigins;
    private _handlers;
    constructor(options: ServerApplicationOptions);
    get protocol(): string;
    get host(): string;
    get port(): number;
    get origin(): string;
    get secure(): boolean;
    get endpoint(): string;
    addHandler(handler: RouteHandler): void;
    route(path: string, method: Method, handler: RouteHandleCallback): void;
    get(path: string, handler: RouteHandleCallback): void;
    post(path: string, handler: RouteHandleCallback): void;
    put(path: string, handler: RouteHandleCallback): void;
    patch(path: string, handler: RouteHandleCallback): void;
    delete(path: string, handler: RouteHandleCallback): void;
    start(): Promise<void>;
    getMimeType(filePathOrFileName: string): any;
    private _handleRequest;
    private isPathMatch;
    private _executeHandlers;
}
export {};
