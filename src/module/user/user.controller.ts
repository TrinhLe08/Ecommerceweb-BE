import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { JwtService } from 'src/global/gobalJwt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { User } from '../../entities/user.entity';
import { UserType } from 'src/utils/user.type';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfirmCodeService } from './confirm-code.service';
import { log } from 'handlebars';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly confirmCodeService: ConfirmCodeService,
    private mailerService: MailerService,
  ) {}

  @Get('all')
  async getAllUser(): Promise<ResponseData<User[]>> {
    try {
      const allUser = await this.userService.getAll();
      return new ResponseData<User[]>(
        allUser,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('detail/:id')
  async getdetailUser(@Param('id') id: number): Promise<ResponseData<User>> {
    try {
      const detailUser = await this.userService.findOne(id);
      if (detailUser) {
        delete detailUser.password;
      }
      return new ResponseData<User>(
        detailUser,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post('create')
  async registerUser(
    @Body() user: UserType,
  ): Promise<ResponseData<User | string>> {
    try {
      if (
        user.hasOwnProperty('email') &&
        user.hasOwnProperty('urlAvatar') &&
        user.hasOwnProperty('password') &&
        user.hasOwnProperty('name') &&
        user.hasOwnProperty('phoneNumber') &&
        user.hasOwnProperty('country') &&
        user.hasOwnProperty('city') &&
        user.hasOwnProperty('address') &&
        user.hasOwnProperty('spent') &&
        user.hasOwnProperty('point') &&
        user.hasOwnProperty('role')
      ) {
        const existingUser = await this.userService.findByEmail(user.email);
        if (existingUser) {
          return new ResponseData<string>(
            'Email already exists',
            HttpStatus.ERROR,
            HttpMessage.ERROR,
          );
        }
        let newUser = user;
        newUser.password = this.jwtService.sign(user.password);
        const createUser = await this.userService.create(newUser);

        this.mailerService
          .sendMail({
            to: newUser.email,
            subject: 'Thank you for shopping at LEIF SHOP.',
            template: './pay-ment',
            context: {
              name: newUser.email,
            },
          })
          .then(() => {
            console.log('Email sent successfully');
          })
          .catch((error) => {
            console.error('Failed to send email:', error);
          });

        return new ResponseData<User>(
          createUser,
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      } else {
        return new ResponseData<string>(
          'Lack of information',
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
      }
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post('login')
  async loginUser(@Body() user: { email: string; password: string }) {
    try {
      const User = await this.userService.findByEmail(user.email);
      if (!User) {
        return new ResponseData<string>(
          'Account does not exist',
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
      } else {
        const userPassword = this.jwtService.verify(User.password);
        if (userPassword === user.password) {
          const token: string = jwt.sign({ User }, 'key', {
            expiresIn: '24h',
          });
          const returnInformation: {
            id: number;
            email: string;
            urlAvatar: string;
            token: string;
            bought: number[];
          } = {
            id: User.id,
            email: User.email,
            urlAvatar: User.urlAvatar,
            token,
            bought: User.bought,
          };
          return new ResponseData<any>(
            returnInformation,
            HttpStatus.SUCCESS,
            HttpMessage.SUCCESS,
          );
        } else {
          return new ResponseData<string>(
            'Wrong email or password',
            HttpStatus.ERROR,
            HttpMessage.ERROR,
          );
        }
      }
    } catch (err) {
      console.log(err);
      return new ResponseData<string>(
        'Wrong email or password',
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post('confirm-mail')
  async confirmMail(@Body() userMail: { mail: string }) {
    try {
      const User = await this.userService.findByEmail(userMail.mail);
      if (User) {
        const verificationCode = this.userService.createRandomCode(6);
        await this.confirmCodeService.create({
          code: verificationCode,
        });
        await this.mailerService.sendMail({
          to: userMail.mail,
          subject: 'Send a code .',
          template: './confirm-password',
          context: {
            confirmCode: verificationCode,
          },
        });

        return new ResponseData<boolean>(
          true,
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      } else {
        return new ResponseData<boolean>(
          false,
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
      }
    } catch (err) {
      console.log(err);
      return new ResponseData<boolean>(
        false,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post('confirm-code')
  async confirmCode(@Body() CODE: { code: string }) {
    try {
      const confirm = await this.confirmCodeService.findCode(CODE.code);
      if (confirm) {
        await this.confirmCodeService.remove(confirm.id);
        return new ResponseData<boolean>(
          true,
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      } else {
        return new ResponseData<boolean>(
          false,
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
      }
    } catch (err) {
      console.log(err);
      return new ResponseData<boolean>(
        false,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post('change-password')
  async changePassword(
    @Body() information: { email: string; newPassword: string },
  ) {
    try {
      const checkUser = await this.userService.findByEmail(information.email);
      if (checkUser) {
        const tokenPassword = await this.jwtService.sign(
          information.newPassword,
        );
        const change = await this.userService.updatePassword(
          checkUser.id,
          tokenPassword,
        );
        if (change) {
          return new ResponseData<boolean>(
            true,
            HttpStatus.SUCCESS,
            HttpMessage.SUCCESS,
          );
        } else {
          return new ResponseData<boolean>(
            false,
            HttpStatus.ERROR,
            HttpMessage.ERROR,
          );
        }
      }
      return new ResponseData<boolean>(
        false,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<boolean>(
        false,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Delete('delete/:id')
  async getdeleteUser(@Param('id') id: number): Promise<ResponseData<User>> {
    try {
      await this.userService.remove(id);
      const allUser = await this.userService.getAll();
      return new ResponseData<User>(
        allUser,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post('update')
  @UseInterceptors(FileInterceptor('urlAvatar'))
  async updateUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() user: User,
  ): Promise<ResponseData<User | string>> {
    try {
      const detailUser = await this.userService.findOne(user.id);
      if (file) {
        const userUrlAvatar = await this.cloudinaryService.uploadFile(file);
        user.urlAvatar = userUrlAvatar.url;
        const updateUser = await this.userService.update(user.id, user);
        if (updateUser) {
          delete updateUser.password;
        }
        return new ResponseData<User | string>(
          updateUser,
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      } else {
        user.urlAvatar = detailUser.urlAvatar;
        const updateUser = await this.userService.update(user.id, user);
        if (updateUser) {
          delete updateUser.password;
        }
        return new ResponseData<User | string>(
          updateUser,
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      }
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
