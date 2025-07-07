import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserType } from 'src/utils/user.type';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelComeConfirmation(user: UserType): Promise<void> {
    let newUser = user
        this.mailerService
          .sendMail({
            to: newUser.email,
            subject: 'Thank you for shopping at LEIF SHOP.',
            template: 'welcome',
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
  }

  async sendConfirmCode(userMail: {mail:string}, verificationCode: string) {
        this.mailerService
          .sendMail({
            to: userMail.mail,
            subject: 'Send a code .',
            template: 'confirm-password',
            context: {
              confirmCode: verificationCode,
            },
          })
          .then(() => {
            console.log('Email sent successfully');
          })
          .catch((error) => {
            console.error('Failed to send email:', error);
          });
  }

  async sendNotificationPayMent(usermail: string) {
          this.mailerService
            .sendMail({
              to: usermail,
              subject: 'Thank you for shopping at LEIF SHOP.',
              template: './pay-ment',
              context: {
                name: usermail,
              },
            })
            .then(() => {
              console.log('Email sent successfully');
            })
            .catch((error) => {
              console.error('Failed to send email:', error);
            });
  }
}