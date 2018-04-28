import * as passport from 'passport';
import { CanActivate, ExecutionContext, mixin, UnauthorizedException } from '@nestjs/common';
import { Config } from '../../../config';

export function AuthGuard(type, options: any = {}) {
  options = { ...Config.get('/passportOptions'), ...options };
  return mixin(
    class implements CanActivate {

      async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpContext = context.switchToHttp();
        const [request, response] = [
          httpContext.getRequest(),
          httpContext.getResponse(),
        ];

        request[options.property] = await new Promise((resolve, reject) =>
          passport.authenticate(type, options, (err, user, info) => {
            if (err || !user) {
              return reject(err || new UnauthorizedException());
            }
            resolve(user);
          })(request, response, resolve),
        );

        return true;
      }

    }
  );
}