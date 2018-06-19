import { RegisterController } from './register.controller';
import { HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Test } from '@nestjs/testing';

describe('RegisterController', () => {
  let userService;
  let registerController: RegisterController;

  beforeEach(async () => {

    const module = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [{
        provide: UserService,
        useValue: {
          doesUsernameOrEmailExist: jest.fn(),
          register: jest.fn()
        }
      }],
    }).compile();

    userService = module.get(UserService);
    registerController = module.get(RegisterController);
  });

  describe('POST /register', () => {
    it('should throw error if username is taken', async () => {
      userService.doesUsernameOrEmailExist.mockReturnValue({
        username: true,
        email: false
      });

      const mockUser: any = {
        username: 'jack',
        email: 'johnson'
      };

      const handler = async () => {
        await registerController.register(mockUser);
      };

      await expect(handler()).rejects.toThrow(HttpException);
      expect(userService.doesUsernameOrEmailExist).toHaveBeenCalledWith('jack', 'johnson');
      expect(userService.register).not.toHaveBeenCalled();
    });

    it('should throw error if email is taken', async () => {
      userService.doesUsernameOrEmailExist.mockReturnValue({
        username: false,
        email: true
      });

      const mockUser: any = {
        username: 'jack',
        email: 'johnson'
      };

      const handler = async () => {
        await registerController.register(mockUser);
      };

      await expect(handler()).rejects.toThrow(HttpException);
      expect(userService.doesUsernameOrEmailExist).toHaveBeenCalledWith('jack', 'johnson');
      expect(userService.register).not.toHaveBeenCalled();
    });

    it('should create the user', async () => {
      userService.doesUsernameOrEmailExist.mockReturnValue({
        username: false,
        email: false
      });
      userService.register.mockReturnValue(undefined);

      const mockUser: any = jest.fn();

      await registerController.register(mockUser);

      expect(userService.register).toHaveBeenCalledWith(mockUser);
    });
  });
});