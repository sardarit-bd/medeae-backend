import Joi from "joi";

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
});

export default loginSchema;
