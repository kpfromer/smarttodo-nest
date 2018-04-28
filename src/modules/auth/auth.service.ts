import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { Config } from '../../config';
import { UserService } from '../user/user.service';
import { Token } from './token.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async createToken(id: string) {
    const expiresIn = Config.get('/jwtExpire'),
      secretOrKey = Config.get('/jwtSecret');
    const user = { id } as Token;
    const token = jwt.sign(user, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token
    };
  }

  async validateUser(user: Token): Promise<boolean> {
    return !!await this.userService.findById(user.id);
  }
}
