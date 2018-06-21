import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  readonly username: string;

  @IsString()
  @MinLength(3)
  @MaxLength(60)
  readonly password: string;
}
