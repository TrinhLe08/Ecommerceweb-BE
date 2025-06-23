import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserType } from 'src/utils/user.type';
import { join } from 'path';
// import welcom from '../templates/email/welcome.hbs';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelComeConfirmation(user: UserType): Promise<void> {
    console.log('Đường dẫn template thực tế:', join(__dirname, '../../templates/email/welcome.hbs'));
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
            template: './confirm-password',
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

  async sendResetPassword(email: string, token: string): Promise<void> {
    const url = `http://example.com/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Your Password',
      template: './reset-password',
      context: {
        name: email.split('@')[0],
        url,
      },
    });
  }

  async sendPlainTextEmail(to: string, subject: string, text: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      text,
    });
  }

  async sendHtmlEmail(to: string, subject: string, html: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      html,
    });
  }
}