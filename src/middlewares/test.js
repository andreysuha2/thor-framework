import Middleware from "core-middleware";

class TestMiddleware extends Middleware {
    handle(next, { response, request }) {
        console.log("test middleware");
        console.log(this.params);
        console.log(this.routeParams);
        next();
    }
}

export default TestMiddleware;