import Joi from "joi";

export default Joi.object({
    args: {
        name: Joi.string().required(),
        crud: Joi.boolean().allow(),
        methods: Joi.string().allow()
    },
    options: Joi.array().length(0)
});