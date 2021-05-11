export default function (route) {
    route.post("/", ({ response, data }) => {
        console.log(data);
        response.send("welcome!");
    }).request("TestValidator:419,validation error");
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