import { Data } from '@jeremy-bankes/toolbox';
import http from 'http';
import https, { ServerOptions } from 'https';
import mimeTypes from './mimeTypes.js';
import Request from './Request.js';
import Response from './Response.js';
import RouteHandler from './RotueHandler.js';
import { StaticFileHandler } from './tools.js';
import { Method, RouteHandleCallback } from './types.js';

interface ServerApplicationOptions {
    protocol?: string,
    host?: string,
    port?: number,
    ssl?: {
        key: string,
        certificate: string
    },
    allowOrigins?: string[],
    static?: string
}

export default class ServerApplication {

    public mimeTypes: { [key: string]: string };

    private _server: http.Server | https.Server;
    private _protocol: string;
    private _host: string;
    private _port: number;
    private _key: string;
    private _certificate: string;
    private _allowOrigins: string[];

    private _handlers: RouteHandler[];

    public constructor(options: ServerApplicationOptions) {
        this._server = null;
        this._protocol = Data.get(options, 'protocol', 'http');
        this._host = Data.get(options, 'host', '127.0.0.1');
        this._port = Data.get(options, 'port', 80);
        this._key = Data.get(options, 'ssl.key');
        this._certificate = Data.get(options, 'ssl.certificate');
        this._allowOrigins = Data.get(options, 'allowOrigins', []);
        this.mimeTypes = Data.clone(mimeTypes, true);
        this._handlers = [];

        if (Data.has(options, 'static')) {
            this.addHandler(new StaticFileHandler(options.static));
        }
    }

    public get protocol() {
        return this._protocol;
    }

    public get host() {
        return this._host;
    }

    public get port() {
        return this._port;
    }

    public get origin() {
        return `${this.protocol}://${this.host}${this.port === 80 ? '' : ':' + this.port}`;
    }

    public get secure() {
        return this._key !== undefined && this._certificate !== undefined;
    }

    public get endpoint() {
        return `${this._protocol}://${this._host}:${this._port}`;
    }

    public addHandler(handler: RouteHandler) {
        this._handlers.push(handler);
    }

    public route(path: string, method: Method, handler: RouteHandleCallback) {
        this.addHandler(new RouteHandler(path, method, handler));
    }

    public get(path: string, handler: RouteHandleCallback) { this.route(path, Method.GET, handler); }
    public post(path: string, handler: RouteHandleCallback) { this.route(path, Method.POST, handler); }
    public put(path: string, handler: RouteHandleCallback) { this.route(path, Method.PUT, handler); }
    public patch(path: string, handler: RouteHandleCallback) { this.route(path, Method.PATCH, handler); }
    public delete(path: string, handler: RouteHandleCallback) { this.route(path, Method.DELETE, handler); }

    public async start() {
        const serverModule = this.secure ? https : http;
        const options: ServerOptions = {};

        if (this.secure) {
            options.key = this._key;
            options.cert = this._certificate;
        }

        this._server = serverModule.createServer(options, (requestHandle, responseHandle) => {
            this._handleRequest(new Request(this, requestHandle), new Response(this, responseHandle));
        });

        await new Promise<void>((resolve) => this._server.listen(this.port, this.host, resolve));
    }

    public getMimeType(filePathOrFileName: string) {
        const match = filePathOrFileName.match(/(?<=\.)[a-z0-9]+$/gi);
        if (match === null) {
            return mimeTypes.txt;
        } else {
            const extension = match[0];
            return extension in mimeTypes ? mimeTypes[extension] : mimeTypes.txt;
        }
    }

    private async _handleRequest(request: Request, response: Response) {
        try {
            await this._executeHandlers(request, response);
            if (!response.finished) {
                response.sendString(`No routes registered to handle ${request.method} ${request.path}.`, { status: 404 });
            }
        } catch (error) {
            response.sendString(`Fatal error. ${error instanceof Error ? error.stack : error.toString()}`, { status: 400 });
        }
    }

    private isPathMatch(path: string, test: string) {
        if (test === '*') {
            return true;
        }
        return path === test;
    }

    private async _executeHandlers(request: Request, response: Response) {
        for (const handler of this._handlers) {
            if (this.isPathMatch(request.path, handler.path)) {
                await Promise.resolve(handler.handle(request, response));
                if (response.finished) {
                    break;
                }
            }
        }
    }

}