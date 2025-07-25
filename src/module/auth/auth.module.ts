import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from './facebook.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [FacebookStrategy],
})
export class AuthModule {}