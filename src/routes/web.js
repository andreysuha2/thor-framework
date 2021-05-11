export default function (route) {
    route.get("/", { use: "WelcomeController@welcome", dynamic: false });
    route.get("/test", ({ response }) => response.send("test"));
};