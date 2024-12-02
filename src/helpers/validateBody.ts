import joi from 'joi';

export const joiSchemaRegister = joi.object({
    email: joi.string().email().required(),
    name: joi.string().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    passwordConfirmation: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

export const joiSchemaLogin = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

export const joiSchemaCreateVehicle = joi.object({
    brand: joi.string().required(),
    model: joi.string().required(),
    capacity: joi.number().required(),
    luggage_capacity: joi.number().required(),
    price_per_km: joi.number().required(),
    img_url: joi.string().required(),
    status: joi.boolean().required(),
});

