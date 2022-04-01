import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { AuthModule } from './modules/auth/auth.module';
import { AppResolver } from './app.resolver';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env'
          : ['.env.development.local', '.env.development', '.env'],
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          installSubscriptionHandlers: true,
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          apollo: {
            key: configService.get('APOLLO_KEY'),
            graphId: configService.get('APOLLO_GRAPH_ID'),
            graphVariant: configService.get('APOLLO_GRAPH_VARIANT'),
            graphReference: configService.get('APOLLO_SCHEMA_REPORTING'),
          },
          plugins: [ApolloServerPluginInlineTrace()],
          uploads: false,
          sortSchema: true,
          autoSchemaFile: './src/schema.graphql',
          debug: configService.get('GRAPHQL_DEBUG') || true,
          playground: configService.get('GRAPHQL_PLAYGROUND') || true,
          context: ({ req }) => ({ req }),
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
