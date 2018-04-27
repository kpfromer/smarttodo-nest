import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  readonly username: string;

  @IsString()
  @MinLength(3)
  @MaxLength(60)
  readonly password: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly lastName: string;
}
