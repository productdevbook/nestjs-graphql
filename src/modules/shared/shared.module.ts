import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configModuleOptions } from './configs/module-options';

import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { isArray } from 'class-validator';



@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('database.host'),
                port: configService.get<number | undefined>('database.port'),
                database: configService.get<string>('database.name'),
                username: configService.get<string>('database.user'),
                password: configService.get<string>('database.pass'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: false,
                debug: configService.get<string>('env') === 'development',
            }),
        }),
        GraphQLModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const data = {
                    installSubscriptionHandlers: true,
                    buildSchemaOptions: {
                        numberScalarMode: 'integer',
                    },
                    plugins: [ApolloServerPluginInlineTrace()],
                    uploads: false,
                    sortSchema: true,
                    autoSchemaFile: './schema.graphql',
                    debug: configService.get<boolean>('graphql.debug') || true,
                    playground: configService.get<boolean>('graphql.playground') || true,
                    context: ({ req }) => ({ req }),
                    formatError: (error: GraphQLError) => gqlErrorFormatter(error),

                } as GqlModuleOptions;

                const hasKey = configService.get<string>('apollo.key')

                if (hasKey) {
                    return {
                        ...data,
                        apollo: {
                            key: configService.get<string>('apollo.key'),
                            graphId: configService.get<string>('apollo.graphqlId'),
                            graphVariant: configService.get<string>('apollo.graphqlVariant'),
                            graphReference: configService.get<string>('apollo.graphReference'),
                        },
                    }
                } else {
                    return data
                }
            },
        }),
    ],
    exports: [ConfigModule],

})
export class SharedModule { }


const gqlErrorFormatter = (error: GraphQLError) => {
    if (error.extensions.response && isArray(error.extensions.response.message)) {
        const extensions = {
            code: error.extensions.response.statusCode,
            errors: error.extensions.response.message,
        };

        const graphQLFormattedError: GraphQLFormattedError = {
            message: error.extensions.code,
            extensions: extensions,
        };
        return graphQLFormattedError;
    } else {
        console.log(error.message);
        const graphQLFormattedError: GraphQLFormattedError = {
            message: error.message,
            extensions: error.extensions,
        };
        return graphQLFormattedError;
    }
};
