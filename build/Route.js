export default class Route {
    constructor(pathMatcher) {
        this._pathMatcher = pathMatcher;
    }
    matches(path) {
        return path === this._pathMatcher;
    }
    handle(request, response) {
    }
}
