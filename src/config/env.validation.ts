import * as Joi from '@hapi/joi';

export const validationSchema = Joi.object({
  // Servidor
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // EMAIL
  RESEND_API_KEY: Joi.string().required(),

  // Database
  DATABASE_URL: Joi.string().required(),
});
