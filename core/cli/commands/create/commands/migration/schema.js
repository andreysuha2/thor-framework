import Joi from "joi";

export default Joi.object({
    args: {
        name: Joi.string().required()
    },
    options: Joi.array().length(0)
});