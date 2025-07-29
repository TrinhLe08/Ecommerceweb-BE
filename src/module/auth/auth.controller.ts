import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { UserType } from 'src/utils/user.type';
import { MailService } from 'src/external/mail/mail.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private mailerService: MailService,

  ) { }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> { }

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookRedirect(@Req() req, @Res() res) {
    try {
      const informationUser = req.user;
      const emailUser = informationUser.email
      const User = await this.userService.findByEmail(emailUser);

      if (User) {
        const token: string = jwt.sign({ informationUser }, 'key', {
          expiresIn: '24h',
        });
        const returnInformation: {
          id: number;
          email: string;
          urlAvatar: string;
          name: string,
          token: string;
          bought: number[];
        } = {
          id: User.id,
          email: informationUser.email,
          urlAvatar: User.urlAvatar,
          name: User.name,
          token,
          bought: User.bought,
        };
        const dataString = encodeURIComponent(JSON.stringify(returnInformation));
        res.redirect(`${process.env.URL_FRONTEND}?token=${dataString}`);
        return
      } else {
        const informationRegister: UserType = {
          email: emailUser,
          password: "",
          urlAvatar: informationUser.picture,
          name: informationUser.name,
          phoneNumber: "",
          country: "",
          city: "",
          address: "",
          spent: 0,
          point: 0,
          bought: [],
          role: "user",
        };
        const createUser = await this.userService.create(informationRegister);
        if (createUser) {
          const token: string = jwt.sign({ informationUser }, 'key', {
            expiresIn: '24h',
          });
          this.mailerService.sendWelComeConfirmation(informationRegister)
          const returnInformation: {
            id: number;
            email: string;
            urlAvatar: string;
            name: string,
            token: string;
            bought: number[];
          } = {
            id: createUser.id,
            email: informationUser.email,
            urlAvatar: informationUser.picture,
            name: informationUser.name,
            token,
            bought: [0],
          };
          const dataString = encodeURIComponent(JSON.stringify(returnInformation));
          res.redirect(`${process.env.URL_FRONTEND}?token=${dataString}`);
        }
        return
      }
    } catch (err) {
      console.log(err, "FROM FACEBOOK/REDIRECT");
      return
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() { }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    try {
      const informationUser = req.user;
      const emailUser = informationUser.email
      const User = await this.userService.findByEmail(emailUser);
      if (User) {
        const token: string = jwt.sign({ informationUser }, 'key', {
          expiresIn: '24h',
        });
        const returnInformation: {
          id: number;
          email: string;
          urlAvatar: string;
          name: string,
          token: string;
          bought: number[];
        } = {
          id: User.id,
          email: User.email,
          urlAvatar: User.urlAvatar,
          name: User.name,
          token,
          bought: User.bought,
        };
        const dataString = encodeURIComponent(JSON.stringify(returnInformation));
        res.redirect(`${process.env.URL_FRONTEND}?token=${dataString}`);
        return
      } else {
        const informationRegister: UserType = {
          email: emailUser,
          password: "",
          urlAvatar: informationUser.picture,
          name: informationUser.name,
          phoneNumber: "",
          country: "",
          city: "",
          address: "",
          spent: 0,
          point: 0,
          bought: [],
          role: "user",
        };
        const createUser = await this.userService.create(informationRegister);
        if (createUser) {
          const token: string = jwt.sign({ informationUser }, 'key', {
            expiresIn: '24h',
          });
          this.mailerService.sendWelComeConfirmation(informationRegister)
          const returnInformation: {
            id: number;
            email: string;
            urlAvatar: string;
            name: string,
            token: string;
            bought: number[];
          } = {
            id: createUser.id,
            email: informationUser.email,
            urlAvatar: informationUser.picture,
            name: informationUser.name,
            token,
            bought: [0],
          };
          const dataString = encodeURIComponent(JSON.stringify(returnInformation));
          res.redirect(`${process.env.URL_FRONTEND}?token=${dataString}`);
        }
        return
      }
    } catch (err) {
      console.log(err, "FROM GOOGLE/REDIRECT");
      return
    }

  }
}