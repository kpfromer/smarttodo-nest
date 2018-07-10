import { prop, Typegoose } from 'typegoose';

export class Todo extends Typegoose {
  @prop({required: true})
  description: string;

  @prop({required: true})
  completed: boolean;

  @prop({required: true})
  userId: string;
}