import { LoggedInService } from './logged-in.service';

describe('LoggedInService', () => {
  let loggedInService, mockModel, modelInstance, userId;

  beforeEach(() => {
    mockModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      findOneAndUpdate: jest.fn(),
      deleteOne: jest.fn()
    };
    modelInstance = jest.fn();
    userId = 'a-bunch-of-numbers-letters';

    // jest.spyOn(Config, 'get')
    //   .mockImplementation(value => value === '/userIdProperty' ? userIdProperty : undefined);
    loggedInService = new LoggedInService(mockModel);
  });

  describe('find', () => {
    beforeEach(() => {
      mockModel.find.mockImplementation(() => ({
        lean: () => ({
          exec: () => Promise.resolve(modelInstance)
        })
      }));
    });

    it('finds an instance using the userId but removes the property on return', async () => {
      const result = await loggedInService.find(userId);

      expect(result).toBe(modelInstance);
      expect(mockModel.find).toHaveBeenCalledWith({ userId }, '-userId');
    });
    it('finds an instance with a condition', async () => {
      const conditions = {
        hello: 'world'
      };
      await loggedInService.find(userId, conditions);

      expect(mockModel.find.mock.calls[0][0]).toEqual({
        ...conditions,
        userId
      });
    });
  });
  describe('getAll', () => {
    beforeEach(() => {
      jest.spyOn(loggedInService, 'find').mockResolvedValue(modelInstance);
    });
    it('finds all', async () => {
      const result = await loggedInService.getAll(userId);
      expect(result).toBe(modelInstance);
      expect(loggedInService.find).toHaveBeenCalledWith(userId);
    });
  });
  describe('getById', () => {
    beforeEach(() => {
      mockModel.findOne.mockReturnValue({
        lean: () => ({
          exec: () => Promise.resolve(modelInstance)
        })
      });
    });

    it('finds one item by it\'s id', async () => {
      const id = 'fadsfad1r';
      const result = await loggedInService.getById(userId, id);
      expect(result).toBe(modelInstance);
      expect(mockModel.findOne).toHaveBeenCalledWith({ userId, _id: id });
    });
  });
  describe('create', () => {
    beforeEach(() => {
      mockModel.create.mockResolvedValue(modelInstance);
    });

    // TODO: Update when nestjs allows for proper validation of multiple items
    // it('creates multiple items', async () => {
    //   const items = [
    //     {
    //       name: 'jake',
    //       age: 29
    //     },
    //     {
    //       name: 'paul',
    //       age: 54
    //     },
    //     {
    //       name: 'mark',
    //       age: 34
    //     }
    //   ];
    //
    //   const result = await loggedInService.create(userId, items);
    //   expect(result).toBe(modelInstance);
    //   expect(mockModel.create).toHaveBeenCalledWith([
    //     {
    //       userId,
    //       name: 'jake',
    //       age: 29
    //     },
    //     {
    //       userId,
    //       name: 'paul',
    //       age: 54
    //     },
    //     {
    //       userId,
    //       name: 'mark',
    //       age: 34
    //     }
    //   ]);
    // });
  });
  describe('updateById', () => {
    beforeEach(() => {
      mockModel.findOneAndUpdate.mockReturnValue({
        exec: () => Promise.resolve(modelInstance)
      });
    });

    it('updates an item by it\'s id', async () => {
      const id = 'afadsfasd';
      const newItem = {
        _id: 'id',
        name: 'different',
        age: 6246234
      };
      const result = await loggedInService.updateById(userId, id, newItem);
      expect(result).toBe(modelInstance);
      expect(mockModel.findOneAndUpdate).toHaveBeenCalledWith({ userId, _id: id }, { ...newItem, userId });
    });
  });
  describe('deleteById', () => {
    beforeEach(() => {
      mockModel.deleteOne.mockReturnValue({
        exec: () => Promise.resolve(modelInstance)
      });
    });

    it('removes one item by id', async () => {
      const id = 'adfasdfasd';
      await loggedInService.deleteById(userId, id);
      expect(mockModel.deleteOne).toHaveBeenCalledWith({ userId, _id: id });
    });
  });
});