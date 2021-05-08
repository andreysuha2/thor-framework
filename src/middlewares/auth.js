import MiddlewareAbstract from "core-middleware";

class AuthMiddleware extends MiddlewareAbstract {
    handle(next, { request, response }) {
        console.log("auth middleware");
        //response.error("");
        next();
    }
}

export default AuthMiddleware;