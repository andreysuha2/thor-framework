class MiddlewareAbstract {
    constructor(params, routeParams) {
        this.params = params;
        this.routeParams = routeParams;
    }

    async handle(next) {
        next();
    }
}

export default MiddlewareAbstract;