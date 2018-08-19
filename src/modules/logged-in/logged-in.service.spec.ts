import { LoggedInService } from './logged-in.service';

describe('LoggedInService', () => {
  let service: LoggedInService<any>, model, userId;
  let createObjectId, makeDBObject, makeExecMethod;
  beforeEach(() => {
    createObjectId = (id: string) => ({
      toHexString: () => id
    });
    makeDBObject = (object: object) => ({
      toObject: () => object
    });
    makeExecMethod = (resolvedValue: any) => ({
      exec: () => Promise.resolve(resolvedValue);
    });
    model = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      create: jest.fn(),
      deleteOne: jest.fn()
    };
    userId = 'user-id-numbers';
    service = new LoggedInService(model);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  
  describe('getAll', () => {
    let conditions;
    beforeEach(() => {
      model.find.mockReturnValue(makeExecMethod([
        makeDBObject({
          _id: createObjectId('1'),
          name: 'mick',
          userId
        }),
        makeDBObject({
          _id: createObjectId('2'),
          name: 'joe',
          userId
        })
      ]));
      conditions = {
        name: 'kyle',
        value: false
      };
    })
    it('returns sanitized data by user id', async () => {
      const result = await service.getAll(userId);
      expect(model.find).toHaveBeenCalledWith({ userId });
      expect(result).toMatchSnapshot();
    });
    it('filters by conditions', async () => {
      await service.getAll(userId, conditions);
      expect(model.find).toBeCalledWith({
        userId,
        name: 'kyle',
        value: false
      });
    });
  });
  describe('getById', () => {
    let itemId;
    beforeEach(() => {
      model.findOne.mockReturnValue(makeExecMethod(
        makeDBObject({
          _id: createObjectId('666'),
          name: 'jack daniels',
          userId
        })
      ));
      itemId = 'item_id_123';
    });
    it('gets all items by user id and item id', async () => {
      const result = await service.getById(userId, itemId);
      expect(model.findOne).toHaveBeenCalledWith({ userId, _id: itemId });
      expect(result).toMatchSnapshot();
    });
  });
  describe('create', () => {
    beforeEach(() => {
      model.create.mockResolvedValue(makeDBObject({
        _id: createObjectId('312'),
        name: 'Macy',
        userId
      }));
    });
    it('creates an item with user id', async () => {
      const result = await service.create(userId, {
        name: 'Macy'
      });
      expect(result).toMatchSnapshot();
    });
  });
  describe('updateById', () => {
    beforeEach(() => {
      model.findOneAndUpdate.mockReturnValue(makeExecMethod(
        makeDBObject({
          _id: createObjectId('update_id'),
          name: 'jack',
          userId
        })
      ));
    });
    it('updates an item by id', async () => {
      const itemId = 'item_id';
      const newItem = {
        name: 'jack'
      };
      const result = await service.updateById(userId, itemId, { ...newItem, id: 'SHOULD BE DELETED' });
      expect(model.findOneAndUpdate).toHaveBeenCalledWith({ userId, _id: itemId }, newItem);
      expect(result).toMatchSnapshot();
    });
  });
  describe('deleteById', () => {
    beforeEach(() => {
      model.deleteOne.mockReturnValue(makeExecMethod('DONE'));
    });
    it('deletes the item by id', async () => {
      const itemId = 'item_id';
      const result = await service.deleteById(userId, itemId);
      expect(model.deleteOne).toBeCalledWith({ userId, _id: itemId });
      expect(result).toBe('DONE'); // Makes sure that deleteOne is awaited
    });
  });
});