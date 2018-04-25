import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RouterModule } from 'nest-router';
import { ROUTES } from './routes';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://localhost/smarttodo-nest'),
    RouterModule.forRoutes(ROUTES)
  ]
})
export class AppModule {}