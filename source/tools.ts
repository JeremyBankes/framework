import { Method } from './types.js';
import path from 'path';
import fs from 'fs';
import Response from './Response.js';
import Request from './Request.js';
import RouteHandler from './RotueHandler.js';

export class StaticFileHandler extends RouteHandler {

    private _directory: string;
    private _indexFile: string;

    public constructor(directory: string, indexFile: string = null) {
        super('*', Method.GET);
        this._directory = directory;
        this._indexFile = indexFile;
    }

    public async handle(request: Request, response: Response) {
        const filePath = path.join(this._directory, request.path === '/' && this._indexFile !== null ? this._indexFile : request.path);
        if (fs.existsSync(filePath)) {
            const fileStatistics = fs.statSync(filePath);
            if (fileStatistics.isFile()) {
                return await response.sendFile(filePath);
            }
        }
    }

}