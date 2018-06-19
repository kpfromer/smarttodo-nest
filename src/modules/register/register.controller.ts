import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserDto } from '../../dto/user.dto';

@Controller()
export class RegisterController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async register(@Body() user: UserDto) {
    const usernameOrEmailExist = await this.userService.doesUsernameOrEmailExist(
      user.username,
      user.email
    );

    if (usernameOrEmailExist.username && usernameOrEmailExist.email) {
      throw new HttpException('Username and email are taken', HttpStatus.CONFLICT);
    } else if (usernameOrEmailExist.username) {
      throw new HttpException('Username is taken', HttpStatus.CONFLICT);
    } else if (usernameOrEmailExist.email) {
      throw new HttpException('Email is taken', HttpStatus.CONFLICT);
    }

    await this.userService.register(user);

    return {message: 'Successfully registered!'};
  }
}