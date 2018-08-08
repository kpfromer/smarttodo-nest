import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RouterModule } from 'nest-router';
import { ROUTES } from './routes';
import { RegisterModule } from './modules/register/register.module';
import { AuthModule } from './modules/auth/auth.module';
import { TodoModule } from './modules/todo/todo.module';
import { LoginModule } from './modules/login/login.module';
import { Config } from './config';

@Module({
  imports: [
    TypegooseModule.forRoot(Config.get('/databaseUrl'), {
      useNewUrlParser: true
    }),
    RouterModule.forRoutes(ROUTES),
    AuthModule,
    RegisterModule,
    LoginModule,
    TodoModule
  ]
})
export class AppModule {}