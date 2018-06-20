import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { Config } from '../../config';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../../model/user.model';
import { InstanceType } from 'typegoose';

// TODO: use email instead of id
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async createToken(id: string) {
    const expiresIn = Config.get('/jwtExpire'),
      secretOrKey = Config.get('/jwtSecret');
    const user = { id } as JwtPayload;
    const token = jwt.sign(user, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token
    };
  }

  async validateUser(user: JwtPayload): Promise<InstanceType<User> | null> {
    return await this.userService.findById(user.id);
  }
}
