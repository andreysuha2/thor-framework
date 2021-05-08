export default function (route) {
    route.get("/", ({ response }) => {
        console.log("route controller");
        response.send("welcome!");
    }).middlewares([ "auth", "test:test,test2" ]);
    route.group({ path: "user/{user_id}" }, (route) => {
        route.get("", ({ params: { userId }, response }) => {
            response.send({ user: userId });
        }).middleware("test:test,auth");
        route.post("", ({ params: { userId }, data, response }) => {
            response.send({ user: userId, data });
        });
        route.put("", ({ params: { userId }, response, request }) => {
            response.send({ user: userId, method: request.method });
        });
    }).middlewares([ "auth" ]);
};