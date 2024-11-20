import joi from 'joi';

export const joiSchemaRegister = joi.object({
        email: joi.string().email().required(),
        name: joi.string().required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        passwordConfirmation: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        role: joi.string().required(),
    });

    export const joiSchemaLogin = joi.object({
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    });
