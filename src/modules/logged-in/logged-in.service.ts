import { Injectable } from '@nestjs/common';
import { ModelType } from 'typegoose';
import { Types } from 'mongoose';
import ObjectId = Types.ObjectId;
import { Document } from 'mongoose';

export type WithMongoId<T> = T & {
  _id: ObjectId
}

export type WithPlainId<T> = T & {
  id: string
}

export type CreatedLoggedInModel<T> = T & Document & {
  userId: string;
}

@Injectable()
export class LoggedInService<T, R = WithMongoId<T>> {

  constructor (protected readonly model: ModelType<T>) {}

  sanitize(document: CreatedLoggedInModel<T>) {
    // Convert to regular object
    const plainDocument = document.toObject();
    // Convert _id's ObjectId type to just a string
    const stringId = plainDocument._id.toHexString();
    delete plainDocument.userId;
    delete plainDocument._id
    return {
      // @ts-ignore
      ...plainDocument,
      id: stringId
    }
  }

  async getAll(userId: string, conditions = {}): Promise<WithPlainId<T>[] | null> {
    return (await this.model.find({ ...conditions, userId }).exec() as CreatedLoggedInModel<T>[]).map(this.sanitize);
  }

  async getById(userId: string, id: string): Promise<WithPlainId<T> | null> {
    return this.sanitize(await this.model.findOne({ userId, _id: id }).exec() as CreatedLoggedInModel<T>);
  }

  async create(userId: string, item: T) {
    // @ts-ignore
    return this.sanitize(await this.model.create({ ...item, userId }) as CreatedLoggedInModel<T>);
  }

  async updateById(userId: string, id: string, newItem: T & { id?: string }) {
    delete newItem.id;
    return this.sanitize(await this.model.updateOne({ userId, _id: id }, newItem).exec());
  }

  async deleteById(userId: string, id: string) {
    return await this.model.deleteOne({ userId, _id: id }).exec();
  }
}