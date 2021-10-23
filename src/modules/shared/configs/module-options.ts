import configuration from './configuration';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import * as Joi from 'joi';

export const configModuleOptions: ConfigModuleOptions = {
    envFilePath: '.env',
    load: [configuration],
    validationSchema: Joi.object({
        APP_ENV: Joi.string()
            .valid('development', 'production', 'test')
            .default('development'),
        APP_PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().optional(),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        JWT_PUBLIC_KEY_BASE64: Joi.string().required(),
        JWT_PRIVATE_KEY_BASE64: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXP_IN_SEC: Joi.number().required(),
        JWT_REFRESH_TOKEN_EXP_IN_SEC: Joi.number().required(),
        APOLLO_KEY: Joi.string().optional().allow(''),
        APOLLO_GRAPH_ID: Joi.string().optional().allow(''),
        APOLLO_GRAPH_VARIANT: Joi.string().optional().allow(''),
        APOLLO_SCHEMA_REPORTING: Joi.string().optional().allow(''),
        GRAPHQL_PLAYGROUND: Joi.boolean().optional(),
        GRAPHQL_DEBUG: Joi.boolean().optional(),
    }),
};