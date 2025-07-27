import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { FacebookStrategy } from './facebook.strategy';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { User } from 'src/entities/user.entity';
import { MailService } from 'src/external/mail/mail.service';

@Module({
  imports: [PassportModule,TypeOrmModule.forFeature([User]),],
  controllers: [AuthController],
  providers: [FacebookStrategy, UserService, MailService],
})
export class AuthModule {}