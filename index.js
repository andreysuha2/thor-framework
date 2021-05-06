import bootstrap from "core-bootstrap";
import App from "root/app";

bootstrap.load()
    .then(() => new App())
    .then((app) => app.init())
    .then(() => console.log(`App running at ${new Date()}`));