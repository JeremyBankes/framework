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
import fs from 'fs';
export default class Response {
    constructor(application, handle) {
        this._application = application;
        this._handle = handle;
    }
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve) => {
                this._handle.writeHead(Data.get(options, 'status', 200), Data.get(options, 'message', 'OK'), Data.get(options, 'headers', {}));
                this._handle.write(Data.get(options, 'data', ''));
                this._handle.end(resolve);
            });
        });
    }
    sendFile(filePath, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new Promise((resolve, reject) => {
                fs.readFile(filePath, (error, data) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
            yield this.send(Object.assign({ headers: {
                    'Content-Length': Buffer.byteLength(data),
                    'Content-Type': this._application.getMimeType(filePath)
                }, data }, options));
        });
    }
    sendString(string, options = {}) {
        this.send(Object.assign({ headers: { 'Content-Type': 'text/plain' }, data: string }, options));
    }
    sendRendered(content, options) {
        this.sendFile(content, options);
    }
    redirect(path, options = {}) {
        this.send(Object.assign({ headers: { 'Location': path }, status: 301 }, options));
    }
    get finished() {
        return this._handle.writableEnded;
    }
}
