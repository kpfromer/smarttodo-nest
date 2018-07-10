import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { Todo } from '../../model/todo.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { LoggedInModule } from '../logged-in/logged-in.module';

@Module({
  imports: [
    TypegooseModule.forFeature(Todo),
    LoggedInModule
  ],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
