import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from './facebook.strategy';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { MailService } from 'src/external/mail/mail.service';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([User]),],
  controllers: [AuthController],
  providers: [FacebookStrategy, GoogleStrategy, UserService, MailService],
})
export class AuthModule { }