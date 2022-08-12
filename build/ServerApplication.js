var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const serverModule = this.secure ? https : http;
            const options = {};
            if (this.secure) {
                options.key = this._key;
                options.cert = this._certificate;
            }
            this._server = serverModule.createServer(options, (requestHandle, responseHandle) => {
                this._handleRequest(new Request(this, requestHandle), new Response(this, responseHandle));
            });
            yield new Promise((resolve) => this._server.listen(this._port, this._host, resolve));
        });
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
    _handleRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._executeHandlers(request, response);
                if (!response.finished) {
                    response.sendString(`No routes registered to handle ${request.method} ${request.path}.`, { status: 404 });
                }
            }
            catch (error) {
                response.sendString(`Fatal error. ${error instanceof Error ? error.stack : error.toString()}`, { status: 400 });
            }
        });
    }
    isPathMatch(path, test) {
        if (test === '*') {
            return true;
        }
        return path === test;
    }
    _executeHandlers(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const handler of this._handlers) {
                if (this.isPathMatch(request.path, handler.path)) {
                    yield Promise.resolve(handler.handle(request, response));
                    if (response.finished) {
                        break;
                    }
                }
            }
        });
    }
}
