import Joi from "joi";

export default Joi.object({
    args: {
        name: Joi.string().required(),
        parent: [ Joi.boolean(), Joi.string() ]
    },
    options: Joi.array().items("c", "v", "d", "s").max(4)
});