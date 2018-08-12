import { ModelType } from 'typegoose';
import { WithMongoId } from './logged-in.service';
import { Config } from '../../config';

export class PositionHelper<T> {

  constructor(private readonly model: ModelType<T>) {}

  async getItemsWithWeight<T>(conditions?: object): Promise<(WithMongoId<T> & { weight: number })[] | null> {
    return await this.model.find(conditions)
      .sort({
        weight: 1
      })
      .lean()
      .exec();
  };

  async reassignWeightByIndex<T>(items: WithMongoId<T>[]) {
    const bulkUpdate = items.map((item, position) => {
      const updatedWeightItem = {
        // @ts-ignore (see https://github.com/Microsoft/TypeScript/pull/13288)
        ...item,
        weight: position * Config.get('/todoWeightStep')
      };

      return {
        updateOne: {
          filter: { _id: item._id },
          update: updatedWeightItem
        }
      }
    });

    await this.model.bulkWrite(bulkUpdate);
  };
// TODO: FIX PARAM
  async recheckIsInPosition<T>(items: WithMongoId<T>[], item: WithMongoId<T>, position: number) {
    // Recheck if the item is that the request position
    // if not, the weights of the items are no longer stable and need to be reassigned
    const id = item._id.toHexString();
    if (items[position]._id.toHexString() !== id) {
      const realIdPosition = items.findIndex(item => item._id.toHexString() === id);
      if (realIdPosition === -1) {
        throw new Error(`Item with id: ${id} was removed!`);
      }
      const repositionedItems = [
        ...items.slice(0, realIdPosition),
        ...items.slice(realIdPosition + 1)
      ];
      // Re add item back into correct location
      repositionedItems.splice(position, 0, item);
      await this.reassignWeightByIndex(repositionedItems);
    }
  };
  // TODO: FIX PARAM
  async getWeight<T>(conditions: object = {}, position: number = null, oldPosition = null, operation: (weight: number) => Promise<{ item: WithMongoId<T>, returnValue: any }>) {
    const items = await this.getItemsWithWeight<T>(conditions);

    if (position === null)
      position = items.length - 1;

    let diff = -1;
    // Fixes comparison of same item weight with other causing the weight to change but will still be in same position
    if (oldPosition !== null)
      diff = position - oldPosition === 1 ? 0 : -1;

    let weight;

    if (position === 0 && typeof items[0] !== 'undefined') {
      weight = items[0].weight - Config.get('/todoWeightStep');
    } else if (position === items.length - 1 && typeof items[items.length - 1] !== 'undefined') {
      weight = items[items.length - 1].weight + Config.get('/todoWeightStep');
    } else if (typeof items[position + diff] !== 'undefined' && typeof items[position + diff + 1] !== 'undefined') {
      weight = (items[position + diff].weight + items[position + diff + 1].weight) / 2;
    } else {
      weight = position * Config.get('/todoWeightStep');
    }

    const { item, returnValue } = await operation(weight);

    // Ignoring the promise so that the response is faster
    this.recheckIsInPosition<T>(items, item, position);

    return returnValue;
  };
}
