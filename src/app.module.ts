import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RouterModule } from 'nest-router';
import { ROUTES } from './routes';
import { RegisterModule } from './modules/register/register.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://localhost/smarttodo-nest'),
    RouterModule.forRoutes(ROUTES),
    RegisterModule,
    AuthModule
  ]
})
export class AppModule {}