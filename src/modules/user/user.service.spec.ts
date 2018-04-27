import { UserService } from './user.service';
import { UserDto } from '../../dto/user.dto';

describe('UserService', () => {

  let mockUserModel;
  let userService: UserService;

  beforeEach(() => {
    mockUserModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn()
    };

    userService = new UserService(mockUserModel);
  });

  describe('register', () => {
    it('should create user', async () => {
      const newUser = jest.fn();
      mockUserModel.create.mockResolvedValue(newUser);

      const user = {
        username: 'kyle',
        password: 'i am a password',
        email: 'example@gmail.org',
        firstName: 'kyle',
        lastName: 'pfromer'
      } as UserDto;

      const result = await userService.register(user);

      expect(mockUserModel.create).toHaveBeenCalledWith(user);
      expect(result).toBe(newUser);
    });
  });

  describe('findByUsername', () => {
    it('should return user by username', async () => {
      const newUser = jest.fn();
      mockUserModel.findOne.mockImplementation(() => ({
        exec: () => Promise.resolve(newUser)
      }));

      const username = 'kyle jack mack';

      const result = await userService.findByUsername(username);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({username});
      expect(result).toBe(newUser);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      const newUser = jest.fn();
      mockUserModel.findOne.mockImplementation(() => ({
        exec: () => Promise.resolve(newUser)
      }));

      const email = 'example@gmail.org';

      const result = await userService.findByEmail(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({email});
      expect(result).toBe(newUser);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const newUser = jest.fn();

      mockUserModel.findById.mockImplementation(() => ({
        exec: () => Promise.resolve(newUser)
      }));

      const id = 'mongoid';

      const result = await userService.findById(id);

      expect(mockUserModel.findById).toHaveBeenCalledWith(id);
      expect(result).toBe(newUser);
    });
  });

  describe('doesUsernameOrEmailExist', () => {
    it('should return false for username and email if they don\'t exist', async () => {
      const newUser = {
        username: 'jack',
        email: 'jack@gmail.com'
      };

      mockUserModel.findOne.mockImplementation(() => ({
        exec: () => Promise.resolve(newUser)
      }));

      const username = 'kpfromer';
      const email = 'example@gmail.org';

      const result = await userService.doesUsernameOrEmailExist(username, email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({$or: [{username}, {email}]});
      expect(result).toEqual({
        username: false,
        email: false
      });
    });

    it('should return true if username and email do exist', async () => {
      const matchingUser = {
        username: 'kpfromer',
        email: 'example@gmail.org'
      };

      mockUserModel.findOne.mockImplementation(() => ({
        exec: () => Promise.resolve(matchingUser)
      }));

      const username = 'kpfromer';
      const email = 'example@gmail.org';

      const result = await userService.doesUsernameOrEmailExist(username, email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({$or: [{username}, {email}]});
      expect(result).toEqual({
        username: true,
        email: true
      });
    });

    it('should return false for both user doesn\'t exist', async () => {
      const noUser = null;

      mockUserModel.findOne.mockImplementation(() => ({
        exec: () => Promise.resolve(noUser)
      }));

      const username = 'kpfromer';
      const email = 'example@gmail.org';

      const result = await userService.doesUsernameOrEmailExist(username, email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({$or: [{username}, {email}]});
      expect(result).toEqual({
        username: false,
        email: false
      });
    });
  });

  describe('getValidUser', () => {
    it('should return user if user password matches', async () => {
      const matchedUser = {
        username: 'kpfromer',
        matchPassword: jest.fn().mockResolvedValue(true)
      };

      jest.spyOn(userService, 'findByUsername').mockResolvedValue(matchedUser);

      const value = await userService.getValidUser('kpfromer', 'password123');

      expect(matchedUser.matchPassword).toHaveBeenCalledWith('password123');
      expect(value).toBe(matchedUser);
    });

    it('should return null if user password doesn\'t match database', async () => {
      const matchedUser = {
        username: 'kpfromer',
        matchPassword: jest.fn().mockResolvedValue(false)
      };

      jest.spyOn(userService, 'findByUsername').mockResolvedValue(matchedUser);

      const value = await userService.getValidUser('kpfromer', 'password123');

      expect(matchedUser.matchPassword).toHaveBeenCalledWith('password123');
      expect(value).toBeNull();
    });

    it('should return null if there is no user in database', async () => {
      const noUser = null;

      jest.spyOn(userService, 'findByUsername').mockResolvedValue(noUser);

      const value = await userService.getValidUser('kpfromer', 'password123');

      expect(value).toBeNull();
    });
  });

});