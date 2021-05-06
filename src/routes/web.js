export default function (route) {
    route.get("/", (request, response) => response.send("welcome!"));
    route.group({ path: "user/{user_id}" }, (route) => {
        route.get("", ({ params: { userId }, response }) => {
            response.send({ user: userId });
        });
        route.post("", ({ params: { userId }, data, response }) => {
            response.send({ user: userId, data });
        });
        route.put("", ({ params: { userId }, response, request }) => {
            response.send({ user: userId, method: request.method });
        });
    });
};