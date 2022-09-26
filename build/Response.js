import { Data } from '@jeremy-bankes/toolbox';
import fs from 'fs';
export default class Response {
    _application;
    _handle;
    statusCode;
    statusMessage;
    constructor(application, handle) {
        this._application = application;
        this._handle = handle;
    }
    async send(options) {
        return await new Promise((resolve) => {
            this._handle.writeHead(Data.get(options, 'status', 200), Data.get(options, 'message', 'OK'), Data.get(options, 'headers', {}));
            this._handle.write(Data.get(options, 'data', ''));
            this._handle.end(resolve);
        });
    }
    async sendFile(filePath, options = {}) {
        const data = await new Promise((resolve, reject) => {
            fs.readFile(filePath, (error, data) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(data);
                }
            });
        });
        await this.send({
            headers: {
                'Content-Length': Buffer.byteLength(data),
                'Content-Type': this._application.getMimeType(filePath)
            },
            data,
            ...options
        });
    }
    async sendString(string, options = {}) {
        await this.send({
            headers: { 'Content-Type': 'text/plain' },
            data: string,
            ...options
        });
    }
    async sendRendered(content, options = {}) {
        await this.sendFile(content, options);
    }
    redirect(path, options = {}) {
        this.send({
            headers: { 'Location': path },
            status: 301,
            ...options
        });
    }
    get finished() {
        return this._handle.writableEnded;
    }
}
