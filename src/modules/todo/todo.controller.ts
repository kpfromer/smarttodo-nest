import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TodoDto, TodosDto } from '../../dto/todo.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from '../../decorators/userid.decorator';
import { IsObjectIdPipe } from '../../pipe/is-objectid.pipe';
import { LoggedInService } from '../logged-in/logged-in.service';
import { InjectModel } from 'nestjs-typegoose';
import { Todo } from '../../model/todo.model';
import { ModelType } from 'typegoose';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class TodoController {

  constructor(@InjectModel(Todo) private readonly todoModel: ModelType<Todo>, private readonly todoService: LoggedInService<Todo>) {
    this.todoService.setModel(todoModel);
  }

  @Get()
  async getTodos(@UserId() userId) {
    return await this.todoService.getAll(userId);
  }

  @Post()
  async createTodo(@UserId() userId, @Body() todos: TodosDto) {
    return await this.todoService.create(userId, todos);
  }

  @Get(':id')
  async getTodoById(@UserId() userId, @Param('id', IsObjectIdPipe) id: string) {
    return await this.todoService.getById(userId, id);
  }

  @Put(':id')
  async updateTodo(@UserId() userId, @Param('id', IsObjectIdPipe) id: string, @Body() todo: TodoDto) {
    return await this.todoService.updateById(userId, id, todo);
  }

  @Delete(':id')
  async removeTodo(@UserId() userId, @Param('id', IsObjectIdPipe) id: string) {
    return await this.todoService.deleteById(userId, id);
  }
}