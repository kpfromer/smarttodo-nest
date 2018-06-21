import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from 'modules/auth/auth.service';
import { UserService } from 'modules/user/user.service';
import { UserLoginDto } from '../../dto/user-login.dto';

@Controller()
export class LoginController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() user: UserLoginDto) {
    const userModel = await this.userService.getValidUser(user.username, user.password);

    if (!userModel) {
      throw new HttpException(
        'Username/password do not match',
        HttpStatus.BAD_REQUEST
      );
    }

    // if (!userModel.isActive) {
    //   throw new HttpException(
    //     'Inactive user. You must authenticate using your email.',
    //     HttpStatus.BAD_REQUEST
    //   );
    // }

    // console.log(userModel._id);
    return await this.authService.createToken(userModel._id);
  }
}
