import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
      MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
          transport: {
            host: config.get('MAIL_HOST'),
            secure: false,
            auth: {
              user: config.get('MAIL_USER'),
              pass: config.get('MAIL_PASSWORD'),
            },
          },
          defaults: {
            from: `"LEFT SHOP" <${config.get('MAIL_FORM')}>`,
          },
          template: {
            dir: join(__dirname, '../src/external/templates/email'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }),
        inject: [ConfigService],
      }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}