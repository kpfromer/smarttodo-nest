import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '../../model/user.model';
import { InstanceType, ModelType } from 'typegoose';
import { UserDto } from '../../dto/user.dto';

@Injectable()
export class UserService {

  constructor(@InjectModel(User) private readonly userModel: ModelType<User>) {}

  async register(newUser: UserDto): Promise<InstanceType<User>> {
    return await this.userModel.create(newUser);
  }

  async findByUsername(username: string): Promise<InstanceType<User> | null> {
    return await this.userModel.findOne({ username }).exec();
  }
  async findByEmail(email: string): Promise<InstanceType<User> | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async doesUsernameOrEmailExist(
    username: string,
    email: string
  ): Promise<{ username: boolean; email: boolean }> {
    const user = await this.userModel
      .findOne({ $or: [{ username }, { email }] })
      .exec();

    return !user ? {
      username: false,
      email: false
    } : {
      username: user.username === username,
      email: user.email === email
    };

  }

  async getValidUser(username: string, password: string): Promise<InstanceType<User> | null> {
    const user = await this.findByUsername(username);

    return user && await user.matchPassword(password) ? user : null;

  }
}