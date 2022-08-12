import { Data } from '@jeremy-bankes/toolbox';
import fs from 'fs';
import { OutgoingHttpHeaders, ServerResponse } from 'http';
import ServerApplication from './ServerApplication.js';

export type SendOptions = {
    status?: number,
    message?: string,
    headers?: OutgoingHttpHeaders,
    data?: any
};

export default class Response {

    private _application: ServerApplication;
    private _handle: ServerResponse;
    public statusCode: number;
    public statusMessage: string;

    public constructor(application: ServerApplication, handle: ServerResponse) {
        this._application = application;
        this._handle = handle;
    }

    public async send(options: SendOptions) {
        return await new Promise((resolve) => {
            this._handle.writeHead(
                Data.get(options, 'status', 200),
                Data.get(options, 'message', 'OK'),
                Data.get(options, 'headers', {})
            );
            this._handle.write(Data.get(options, 'data', ''));
            this._handle.end(resolve);
        });
    }

    public async sendFile(filePath: string, options: SendOptions = {}) {
        const data = await new Promise<Buffer>((resolve, reject) => {
            fs.readFile(filePath, (error, data) => {
                if (error) {
                    reject(error);
                } else {
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

    public sendString(string: string, options: SendOptions = {}) {
        this.send({
            headers: { 'Content-Type': 'text/plain' },
            data: string,
            ...options
        });
    }

    public sendRendered(content: string, options: SendOptions) {
        this.sendFile(content, options);
    }

    public redirect(path: string, options: SendOptions = {}) {
        this.send({
            headers: { 'Location': path },
            status: 301,
            ...options
        });
    }

    public get finished() {
        return this._handle.writableEnded;
    }

}
