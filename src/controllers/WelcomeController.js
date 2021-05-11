import Controller from "core-controller";

class WelcomeController extends Controller {
    #count = 0;

    welcome({ response }) {
        this.#count++;
        response.send(`welcome ${this.#count}`);
    }
}

export default WelcomeController;