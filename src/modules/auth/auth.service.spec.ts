import { AuthService } from './auth.service';
import { JwtPayload } from './jwt-payload.interface';
import * as jwt from 'jsonwebtoken';
import { Config } from 'config';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('AuthService', () => {
  describe('createToken', () => {
    let authService: AuthService;
    let userServiceMock;

    beforeEach(() => {
      userServiceMock = {};

      authService = new AuthService(userServiceMock);
    });

    it('should create a jwt token', async () => {
      const jwttoken = 'jwttoken';
      jest.spyOn(jwt, 'sign').mockReturnValue(jwttoken);

      const expires = 100000;
      const secret = 'jwt secret';

      jest.spyOn(Config, 'get').mockImplementation(name => {
        if (name === '/jwtExpire') {
          return expires;
        } else if (name === '/jwtSecret') {
          return secret;
        }
      });

      const userId = 'adfasdfasdf';

      const value = await authService.createToken(userId);

      expect(value).toEqual({
        expires_in: expires,
        access_token: jwttoken
      });
      expect(jwt.sign).toHaveBeenCalledWith({id: userId}, secret, {expiresIn: expires});
      expect(Config.get).toHaveBeenCalledWith('/jwtExpire');
      expect(Config.get).toHaveBeenCalledWith('/jwtSecret');
    });
  });

  describe('validateUser', () => {
    let authService: AuthService;
    let userServiceMock;

    beforeEach(() => {
      userServiceMock = {
        findById: jest.fn()
      };

      authService = new AuthService(userServiceMock);
    });

    it('should return true user exists', async () => {
      userServiceMock.findById.mockResolvedValue(true);

      const userToken = {
        id: 'i_am_a_user_id'
      } as JwtPayload;

      const valid = await authService.validateUser(userToken);

      expect(userServiceMock.findById).toHaveBeenCalledWith(userToken.id);
      expect(valid).toBe(true);
    });

    it('should return false if user does\'nt exist', async () => {
      userServiceMock.findById.mockResolvedValue(false);

      const userToken = {
        id: 'i_am_a_user_id'
      } as JwtPayload;

      const valid = await authService.validateUser(userToken);

      expect(userServiceMock.findById).toHaveBeenCalledWith(userToken.id);
      expect(valid).toBe(false);
    });
  });
});