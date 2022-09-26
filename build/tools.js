import { Method } from './types.js';
import path from 'path';
import fs from 'fs';
import RouteHandler from './RotueHandler.js';
export class StaticFileHandler extends RouteHandler {
    _directory;
    _indexFile;
    constructor(directory, indexFile = null) {
        super('*', Method.GET);
        this._directory = directory;
        this._indexFile = indexFile;
    }
    async handle(request, response) {
        const filePath = path.join(this._directory, request.path === '/' && this._indexFile !== null ? this._indexFile : request.path);
        if (fs.existsSync(filePath)) {
            const fileStatistics = fs.statSync(filePath);
            if (fileStatistics.isFile()) {
                return await response.sendFile(filePath);
            }
        }
    }
}
