
import { createValidator } from 'express-joi-validation';
import Joi from 'joi';

const validator = createValidator({ passError: true });

const createUser = Joi.object({
    name: Joi.string().trim().required().messages({
        'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'The Email provided needs to be a valid Email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required(),
    joinedCults: Joi.array().items(Joi.string().min(2))
});

export const createUserValidator = validator.body(createUser);