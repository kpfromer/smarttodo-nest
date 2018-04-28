jest.mock('passport', () => ({
  authenticate: jest.fn()
}));
import * as passport from 'passport';
import * as nestcommon from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import * as config from 'config';
import { AuthGuard } from './auth.guard';
import { Token } from '../token.interface';
import any = jasmine.any;

describe('AuthGuard', () => {
  let requestMock;
  let responseMock;
  let contextMock;

  beforeEach(() => {
    requestMock = jest.fn();
    responseMock = jest.fn();

    contextMock = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: () => requestMock,
        getResponse: () => responseMock
      })
    };

    jest.spyOn(nestcommon, 'mixin').mockImplementation(guard => guard);
  });

  // beforeEach(() => {
  //   passport.use(new JwtStrategy({
  //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //     secretOrKey: 'This does not matter'
  //   }, jest.fn()))
  // });

  it('should authenticate user', async () => {
    const options = {property: 'user'};

    jest.spyOn(config.Config, 'get').mockReturnValue({});

    jest.spyOn(passport, 'authenticate').mockImplementation((type, options, callback: (err?, user?, info?) => void) => {
      return (request, response, resolve) => {
        expect(request).toBe(requestMock);
        expect(response).toBe(responseMock);
        return callback(null, {id: 'user_id'} as Token, null)
      }
    });

    const guard = AuthGuard('jwt', options);
    const authenticated = await new guard().canActivate(contextMock);

    expect(authenticated).toBe(true);
    expect(passport.authenticate).toHaveBeenCalledWith('jwt', options, any(Function));
    expect(nestcommon.mixin).toHaveBeenCalledWith(guard);
  });

  it('should not authenticate user if token is invalid', async () => {
    const options = {property: 'user'};

    jest.spyOn(config.Config, 'get').mockReturnValue({});

    jest.spyOn(passport, 'authenticate').mockImplementation((type, options, callback: (err?, user?, info?) => void) => {
      return (request, response, resolve) => {
        return callback(null, null, null)
      }
    });

    const guard = AuthGuard('jwt', options);

    await expect(new guard().canActivate(contextMock)).rejects.toThrow(UnauthorizedException);
  });

  it('should use config defaults for default values', async () => {
    const options = {property: 'user'};

    const configOptionsMock = {
      hello: 'world'
    };

    jest.spyOn(config.Config, 'get').mockReturnValue(configOptionsMock);

    jest.spyOn(passport, 'authenticate').mockImplementation((type, options, callback: (err?, user?, info?) => void) => {
      return (request, response, resolve) => {
        return callback(null, {userId: 'dfasdf'}, null)
      }
    });

    const guard = AuthGuard('jwt', options);

    await new guard().canActivate(contextMock);

    expect(passport.authenticate).toHaveBeenCalledWith('jwt', {...options, ...configOptionsMock}, any(Function));
  });
});