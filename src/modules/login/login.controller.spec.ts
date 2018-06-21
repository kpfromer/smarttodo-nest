import { UserService } from '../user/user.service';
import { Test } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { AuthService } from '../auth/auth.service';
import { HttpException } from '@nestjs/common';

describe('LoginController', () => {
  let authService, userService;
  let loginController: LoginController;

  beforeEach(async () => {

    const module = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getValidUser: jest.fn()
          }
        },
        {
          provide: AuthService,
          useValue: {
            createToken: jest.fn()
          }
        }
      ]
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
    loginController = module.get(LoginController);
  });

  describe('POST /login', () => {
    let username, password, userLogin, mockAuthToken, mockUser;

    beforeEach(() => {
      username = 'testusername';
      password = 'good_password';

      userLogin = {
        username,
        password
      };

      mockUser = {
        _id: 'mock_id'
      };
      mockAuthToken = jest.fn();
    });

    it('should "login" the user by return an auth token', async () => {
      userService.getValidUser.mockResolvedValue(mockUser);
      authService.createToken.mockResolvedValue(mockAuthToken);

      const result = await loginController.login(userLogin);

      expect(result).toBe(mockAuthToken);
      expect(userService.getValidUser).toHaveBeenCalledWith(username, password);
      expect(authService.createToken).toHaveBeenCalledWith(mockUser._id);
    });

    it('throw HttpException if username or password are invalid', async () => {
      userService.getValidUser.mockResolvedValue(null);

      const handler = async () => await loginController.login(userLogin);

      await expect(handler()).rejects.toThrow(HttpException);

      expect(userService.getValidUser).toHaveBeenCalledWith(username, password);
      expect(authService.createToken).not.toHaveBeenCalled();
    });
  });
});