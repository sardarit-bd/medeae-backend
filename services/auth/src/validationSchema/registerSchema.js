import Joi from "joi";

const loginSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string()
});

export default loginSchema;
