import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RouterModule } from 'nest-router';
import { ROUTES } from './routes';
import { RegisterModule } from './modules/register/register.module';
import { AuthModule } from './modules/auth/auth.module';
import { TodoModule } from './modules/todo/todo.module';
import { LoginModule } from './modules/login/login.module';
import { Config } from './config';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { APP_INTERCEPTOR } from '@nestjs/core';

const imports = [
  TypegooseModule.forRoot(Config.get('/databaseUrl'), {
    useNewUrlParser: true
  }),
  RouterModule.forRoutes(ROUTES),
  AuthModule,
  RegisterModule,
  LoginModule,
  TodoModule
];
const providers = [];

if (process.env.NODE_ENV === 'production') {
  // For production error logging
  imports.push(RavenModule.forRoot(Config.get('/sentryURL')));
  // Global watcher
  providers.push({
    provide: APP_INTERCEPTOR,
    useClass: RavenInterceptor(),
  });
}

@Module({
  imports,
  providers
})
export class AppModule {}