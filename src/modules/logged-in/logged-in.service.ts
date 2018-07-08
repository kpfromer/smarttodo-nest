import { Injectable } from '@nestjs/common';
import { ModelType } from 'typegoose';

@Injectable()
export class LoggedInService<T> {

  private model: ModelType<T>;

  setModel(model: ModelType<T>) {
    this.model = model;
  }

  private static USER_ID_PROPERTY = 'userId';

  private attachUserId = (userId, condition = {}) => ({ ...condition, [LoggedInService.USER_ID_PROPERTY]: userId });

  async find(userId, conditions = {}): Promise<T[] | null> {
    return await this.model.find(this.attachUserId(userId, conditions), `-${LoggedInService.USER_ID_PROPERTY}`).exec();
  }

  async getAll(userId): Promise<T[] | null> {
    return await this.find(userId);
  }

  async getById(userId: string, id: string): Promise<T | null> {
    return await this.model.findOne(this.attachUserId(userId, { _id: id })).exec();
  }

  async create(userId, items): Promise<T> {
    return await this.model.create(
      items.map(item => ({ ...item, userId }))
    );
  }

  async updateById(userId, id: string, newModel): Promise<T> {
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