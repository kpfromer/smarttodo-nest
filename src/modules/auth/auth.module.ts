import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  imports: [UserModule],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}