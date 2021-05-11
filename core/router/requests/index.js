import Joi from "joi";
import { isObject } from "core-helpers";

class RequestPreHandler {
    joi = Joi;
    params;
    data;
    request;
    response;
    #errorCode;
    #errorText;

    constructor(params, data, request, response, errorCode = null, errorText = null) {
        this.params = params;
        this.data = data;
        this.request = request;
        this.response = response;
        this.#errorCode = errorCode || "unprocessableEntity";
        this.#errorText = errorText;
    }

    #isValid(valid) {
        if(typeof valid === "boolean") return { errors: {}, not: valid };
        if(isObject(valid)) return { errors: valid.error, not: Boolean(valid.error) };
        throw `Unprocessable validation`;
    }

    async handle() {
        return new Promise(async (resolve, reject) => {
            await this.preValidate();
            const validator = await this.validate(this.joi);
            const valid = this.#isValid(validator);
            if(valid.not) {
                this.response.error(valid.errors, this.#errorCode, this.#errorText);
                reject("Validation failed");
                return;
            }
            await this.postValidate();
            resolve();
        });
    }

    preValidate() { return true; }

    validate(Joi) { return { errors: false }; }

    postValidate() { return true; }
}

export default RequestPreHandler;