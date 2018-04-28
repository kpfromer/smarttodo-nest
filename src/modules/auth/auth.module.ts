import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [UserModule],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}