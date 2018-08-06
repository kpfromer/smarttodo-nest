import { Injectable } from '@nestjs/common';
import { ModelType } from 'typegoose';
import { Types } from 'mongoose';
import ObjectId = Types.ObjectId;

export type WithMongoId<T> = T & {
  _id: ObjectId
}

@Injectable()
export class LoggedInService<T, R = WithMongoId<T>> {

  protected model: ModelType<T>;

  setModel(model: ModelType<T>) {
    this.model = model;
  }

  protected static USER_ID_PROPERTY = 'userId';

  protected attachUserId = (userId, condition = {}) => ({ ...condition, [LoggedInService.USER_ID_PROPERTY]: userId });

  private combineSelects = (...selects) =>
    selects.reduce((previousValue, currentValue) => {
      if (!previousValue) {
        return currentValue
      } else {
        return !!currentValue ? `${previousValue} ${currentValue}` : previousValue
      }
    }, '');

  async find(userId, conditions = {}, select = [], ...rest): Promise<R[] | null> {
    return await this.model.find(this.attachUserId(userId, conditions), this.combineSelects(`-${LoggedInService.USER_ID_PROPERTY}`, ...select), ...rest).lean().exec();
  }

  async getAll(userId): Promise<R[] | null> {
    return await this.find(userId);
  }

  async getById(userId: string, id: string): Promise<R | null> {
    return await this.model.findOne(this.attachUserId(userId, { _id: id })).lean().exec();
  }

  async create(userId, item) {
    return await this.model.create({ ...item, userId });
  }

  async updateById(userId, id: string, newModel) {
    delete newModel._id;
    newModel.userId = userId;
    return await this.model
      .update(this.attachUserId(userId, { _id: id }), newModel, { overwrite: true })
      .exec();
  }

  async deleteById(userId, id: string) {
    return await this.model.deleteOne(this.attachUserId(userId, {_id: id })).exec();
  }
}