import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';


import { AuthModule } from './modules/auth/auth.module';
import { AppResolver } from './app.resolver';
import { SharedModule } from './modules/shared/shared.module';



@Module({
  imports: [
    AuthModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule { }
