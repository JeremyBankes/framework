import { Method } from '../types.js';
import path from 'path';
import fs from 'fs';
export function createStaticFilesMiddleware(directory, indexFile = 'index.html') {
    return {
        path: '*',
        method: Method.GET,
        handler: (request, response) => {
            const filePath = path.join(directory, request.path === '/' ? indexFile : request.path);
            if (fs.existsSync(filePath)) {
                const fileStatistics = fs.statSync(filePath);
                if (fileStatistics.isFile()) {
                    response.sendFile(filePath);
                    return true;
                }
            }
            return false;
        }
    };
}
;
