import { PositionHelper } from './position.helper';
import { Config } from '../../config';

jest.mock('../../config', () => ({
  Config: {
    get: jest.fn()
  }
}));

describe('position helper', () => {
  let module: PositionHelper<any>, items, mockModel, sort, find, result;
  let mockObjectId;
  beforeEach(async () => {
    // TODO: update items id to be objectid mocks!
    mockObjectId = (id: string) => ({
      toHexString: () => id
    });
    items = [
      {
        _id: mockObjectId('3'),
        name: 'Julian',
        weight: 0
      },
      {
        _id: mockObjectId('2'),
        name: 'Mike',
        weight: 50
      },
      {
        _id: mockObjectId('6'),
        name: 'Kathy',
        weight: 100
      }
    ];
    sort = jest.fn(() => ({
      lean: () => ({
        exec: () => Promise.resolve(items)
      })
    }));
    find = jest.fn(() => ({
      sort
    }));
    mockModel = {
      bulkWrite: jest.fn(),
      find
    };
    module = new PositionHelper(mockModel);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('getItemsWithWeight', () => {
    let mockFind, mockSort, conditions;
    beforeEach(async () => {
      conditions = {
        idUser: 'someIdForUser'
      };
      result = await module.getItemsWithWeight(conditions);
    });
    it('returns model items', async () => {
      expect(result).toBe(items);
    });
    it('sorts model items by weight', () => {
      expect(sort).toHaveBeenCalledWith({
        weight: 1
      });
    });
    it('filters items by conditions', () => {
      expect(find).toHaveBeenCalledWith(conditions);
    })
  });

  describe('reassignWeightByIndex', () => {
    beforeEach(async () => {
      (Config.get as any)
        .mockReturnValue(500); // weight increment amount
      await module.reassignWeightByIndex(items);
    });
    it('updates each items weight based on it\'s index', () => {
      expect(mockModel.bulkWrite.mock.calls[0][0]).toMatchSnapshot();
    });
    it('calls Config for /todoWeightStep', () => {
      expect(Config.get).toHaveBeenCalledWith('/todoWeightStep');
    });
  });
  describe('recheckIsInPosition', () => {
    beforeEach(() => {
      jest.spyOn(module, 'reassignWeightByIndex')
        .mockResolvedValue(undefined);
    });
    it('reassigns position based on index if item id is not at the request position', async () => {
      await module.recheckIsInPosition(items,
        {
          _id: items[0]._id, // TODO move items values into own variables?
          name: 'Julian',
          weight: 0
        }, 2); // Id of '3' wants to be in position 2
      expect(module.reassignWeightByIndex).toHaveBeenCalledWith([
        {
          _id: items[1]._id,
          name: 'Mike',
          weight: 50
        },
        {
          _id: items[2]._id,
          name: 'Kathy',
          weight: 100
        },
        {
          _id: items[0]._id,
          name: 'Julian',
          weight: 0
        }
      ]);
    });
    it('does nothing if it is at the request position', async () => {
      await module.recheckIsInPosition(items, {
        _id: mockObjectId('3'),
        name: 'Julian',
        weight: 0
      }, 0);
      expect(module.reassignWeightByIndex).not.toHaveBeenCalled();
    });
  });
  describe('getWeight', () => {
    // TODO: TEST!
    // let conditions;
    // beforeEach(() => {
    //   jest.spyOn(module, 'getItemsWithWeight')
    //     .mockResolvedValue(items)
    //   (Config.get as any).mockReturnValue();
    //   conditions = {
    //     userIdSomething: 'fasdf'
    //   };
    // });
    // it('calls Config for /todoWeightStep', () => {
    //   module.getWeight(conditions, 1, 0, (weight) => ({
    //
    //   }))
    //   expect(Config.get).toHaveBeenCalledWith('/todoWeightStep');
    // });
    // Reorders item to first position
    // Reorders item to last position
    // Reorders inbetween two other (check if item moved is also right next to the other item THE WEIRD BUG!)
    // Rechecks if item returned from operation is in position (recheckIsInPosition)
    // It returns "returnValue" of operation
  });
});