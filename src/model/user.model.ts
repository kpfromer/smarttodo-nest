import { instanceMethod, InstanceType, pre, prop, staticMethod, Typegoose } from 'typegoose';
import * as bcrypt from 'bcryptjs';
import { Config } from '../config';

@pre<User>('save', async function(next) {
  this.password = await bcrypt.hash(this.password, Config.get('/saltNumber'));
  return next();
})
export class User extends Typegoose {
  @prop({required: true, unique: true})
  username: string;

  // TODO: add exclude: true
  @prop({required: true, })
  password: string;

  @prop({required: true})
  email: string;

  @prop({required: true})
  firstName: string;

  @prop({required: true})
  lastName: string;

  @instanceMethod
  async matchPassword(this: InstanceType<User>, password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
