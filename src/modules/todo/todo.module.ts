import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { Todo } from '../../model/todo.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { LoggedInModule } from '../logged-in/logged-in.module';

@Module({
  imports: [
    TypegooseModule.forFeature(Todo),
    LoggedInModule
  ],
  controllers: [TodoController]
})
export class TodoModule {}
