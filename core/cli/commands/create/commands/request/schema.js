import Joi from "joi";

export default Joi.object({
    args: {
        name: Joi.string().required(),
        pre: Joi.boolean().allow(),
        post: Joi.boolean().allow()
    },
    options: Joi.array().length(0)
});