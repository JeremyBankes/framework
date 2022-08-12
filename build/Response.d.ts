/// <reference types="node" />
import { OutgoingHttpHeaders, ServerResponse } from 'http';
import ServerApplication from './ServerApplication.js';
export declare type SendOptions = {
    status?: number;
    message?: string;
    headers?: OutgoingHttpHeaders;
    data?: any;
};
export default class Response {
    private _application;
    private _handle;
    statusCode: number;
    statusMessage: string;
    constructor(application: ServerApplication, handle: ServerResponse);
    send(options: SendOptions): Promise<unknown>;
    sendFile(filePath: string, options?: SendOptions): Promise<void>;
    sendString(string: string, options?: SendOptions): void;
    sendRendered(content: string, options: SendOptions): void;
    redirect(path: string, options?: SendOptions): void;
    get finished(): boolean;
}
