import { Data } from '@jeremy-bankes/toolbox';
import http from 'http';
import https from 'https';
import mimeTypes from './mimeTypes.js';
import Request from './Request.js';
import Response from './Response.js';
import RouteHandler from './RotueHandler.js';
import { StaticFileHandler } from './tools.js';
import { Method } from './types.js';
export default class ServerApplication {
    mimeTypes;
    _server;
    _protocol;
    _host;
    _port;
    _key;
    _certificate;
    _allowOrigins;
    _handlers;
    constructor(options) {
        this._server = null;
        this._protocol = Data.get(options, 'protocol', 'http');
        this._host = Data.get(options, 'host', 'localhost');
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
    get protocol() {
        return this._protocol;
    }
    get host() {
        return this._host;
    }
    get port() {
        return this._port;
    }
    get origin() {
        return `${this.protocol}://${this.host}${this.port === 80 ? '' : ':' + this.port}`;
    }
    get secure() {
        return this._key !== null && this._certificate !== null;
    }
    get endpoint() {
        return `${this._protocol}://${this._host}:${this._port}`;
    }
    addHandler(handler) {
        this._handlers.push(handler);
    }
    route(path, method, handler) {
        this.addHandler(new RouteHandler(path, method, handler));
    }
    get(path, handler) { this.route(path, Method.GET, handler); }
    post(path, handler) { this.route(path, Method.POST, handler); }
    put(path, handler) { this.route(path, Method.PUT, handler); }
    patch(path, handler) { this.route(path, Method.PATCH, handler); }
    delete(path, handler) { this.route(path, Method.DELETE, handler); }
    async start() {
        const serverModule = this.secure ? https : http;
        const options = {};
        if (this.secure) {
            options.key = this._key;
            options.cert = this._certificate;
        }
        this._server = serverModule.createServer(options, (requestHandle, responseHandle) => {
            this._handleRequest(new Request(this, requestHandle), new Response(this, responseHandle));
        });
        await new Promise((resolve) => this._server.listen(this._port, this._host, resolve));
    }
    getMimeType(filePathOrFileName) {
        const match = filePathOrFileName.match(/(?<=\.)[a-z0-9]+$/gi);
        if (match === null) {
            return mimeTypes.txt;
        }
        else {
            const extension = match[0];
            return extension in mimeTypes ? mimeTypes[extension] : mimeTypes.txt;
        }
    }
    async _handleRequest(request, response) {
        try {
            await this._executeHandlers(request, response);
            if (!response.finished) {
                response.sendString(`No routes registered to handle ${request.method} ${request.path}.`, { status: 404 });
            }
        }
        catch (error) {
            response.sendString(`Fatal error. ${error instanceof Error ? error.stack : error.toString()}`, { status: 400 });
        }
    }
    isPathMatch(path, test) {
        if (test === '*') {
            return true;
        }
        return path === test;
    }
    async _executeHandlers(request, response) {
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
