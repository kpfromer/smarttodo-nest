import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { RegisterController } from './register.controller';

@Module({
  imports: [UserModule],
  controllers: [RegisterController]
})
export class RegisterModule {}