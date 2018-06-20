import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { Config } from '../../config';

/*
To change the default property on request for the user info change options on Authguard via options
see https://github.com/nestjs/passport/blob/master/lib/options.ts

example
```
@UseGuards(AuthGuard('jwt', { property: 'hello' }))
```
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: Config.get('/jwtSecret')
      }
    );
  }

  async validate(payload: JwtPayload, done: Function) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    // sets what is in the request
    // so the following sets request.user = _id
    done(null, user._id);
  }
}
