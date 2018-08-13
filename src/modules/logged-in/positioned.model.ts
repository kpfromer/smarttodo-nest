import { prop, Typegoose } from 'typegoose';

export abstract class PositionedModel extends Typegoose {
  @prop({ required: true })
  readonly weight: number;
}