import { Method, RouteHandler } from './types.js';
import path from 'path';
import fs from 'fs';
export class StaticFileHandler extends RouteHandler {
    constructor(directory, indexFile = 'index.html') {
        super('*', Method.GET);
        this._directory = directory;
        this._indexFile = indexFile;
    }
    handle(request, response) {
        const filePath = path.join(this._directory, request.path === '/' ? this._indexFile : request.path);
        if (fs.existsSync(filePath)) {
            const fileStatistics = fs.statSync(filePath);
            if (fileStatistics.isFile()) {
                response.sendFile(filePath);
                return true;
            }
        }
        return false;
    }
}
