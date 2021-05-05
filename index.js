import Server from "core-server";

new Server(
    process.env.SERVER_PROTOCOL,
    process.env.SERVER_HOST,
    process.env.SERVER_PORT
);