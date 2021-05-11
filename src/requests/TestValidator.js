import RequestPreHandler from "core-request-validator";

class TestValidator extends RequestPreHandler {
    preValidate() {
        const { data } = this.data;
        data.username = "test";
        data.password = "123123123"
    }

    validate(Joi) {
        const { data } = this.data;
        const schema = Joi.object({
            username: Joi.string().min(3).max(10).required(),
            password: Joi.string().min(8).required()
        })
        return schema.validate(data, { abortEarly: false, allowUnknown: true });
    }

    postValidate() {
        const { data } = this.data;
        data.test = "test2";
        console.log("postvalidate");
    }
}

export default TestValidator;