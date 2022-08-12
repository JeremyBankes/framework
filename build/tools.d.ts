import Response from './Response.js';
import Request from './Request.js';
import RouteHandler from './RotueHandler.js';
export declare class StaticFileHandler extends RouteHandler {
    private _directory;
    private _indexFile;
    constructor(directory: string, indexFile?: string);
    handle(request: Request, response: Response): Promise<void>;
}
