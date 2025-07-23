import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from './facebook.strategy';

@Module({
  imports: [PassportModule],
  providers: [FacebookStrategy],
})
export class AuthModule {}