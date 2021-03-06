import { TodoController } from './todo.controller';
import { TodoDto } from '../../dto/todo.dto';

describe('TodoController', () => {
  let userId, expectedValue;
  let todoController, loggedInServiceClass, loggedInService, todoModel;

  beforeEach(() => {
    userId = 'myIdForThisAccount';
    expectedValue = 'VALUE';

    loggedInService = {
      getAll: jest.fn().mockResolvedValue(expectedValue),
      create: jest.fn().mockResolvedValue(expectedValue),
      getById: jest.fn().mockResolvedValue(expectedValue),
      updateById: jest.fn().mockResolvedValue(expectedValue),
      deleteById: jest.fn().mockResolvedValue(expectedValue),
      setModel: jest.fn()
    };
    todoModel = jest.fn();

    loggedInServiceClass = jest.fn()
      .mockImplementation(() => loggedInService);

    todoController = new TodoController(todoModel, loggedInServiceClass);
  });

  it('creates the loggedInService using the Todo model', () => {
    expect(loggedInServiceClass).toHaveBeenCalledWith(todoModel);
  });

  describe('getTodos', () => {
    it('returns loggedInService getAll value', async () => {
      await expect(todoController.getTodos(userId)).resolves.toBe(expectedValue);
      expect(loggedInService.getAll).toHaveBeenCalledWith(userId);
    });
  });

  describe('createTodo', () => {
    it('returns loggedInService create value', async () => {
      const todos = [
        {
          description: 'hello',
          completed: false
        } as TodoDto,
        {
          description: 'world',
          completed: true
        }  as TodoDto
      ];
      await expect(todoController.createTodo(userId, todos)).resolves.toBe(expectedValue);
      expect(loggedInService.create).toHaveBeenCalledWith(userId, todos);
    });
  });

  describe('getTodoById', () => {
    it('returns loggedInService getById value', async () => {
      const todoId = 'todoId';
      await expect(todoController.getTodoById(userId, todoId)).resolves.toBe(expectedValue);
      expect(loggedInService.getById).toHaveBeenCalledWith(userId, todoId);
    });
  });

  describe('updateTodo', () => {
    it('returns loggedInService updateById value', async () => {
      const todoId = 'todoId';
      const todo = {
        description: 'hello world',
        completed: false
      };
      await expect(todoController.updateTodo(userId, todoId, todo)).resolves.toBe(expectedValue);
      expect(loggedInService.updateById).toHaveBeenCalledWith(userId, todoId, todo);
    });
  });

  describe('removeTodo', () => {
    it('returns loggedInService deleteById value', async () => {
      const todoId = 'todoId';
      await expect(todoController.removeTodo(userId, todoId)).resolves.toBe(expectedValue);
      expect(loggedInService.deleteById).toHaveBeenCalledWith(userId, todoId);
    });
  });
});