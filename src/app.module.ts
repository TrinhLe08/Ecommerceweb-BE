import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { UserModule } from './module/user/user.module';
import { ProductModule } from './module/product/product.module';
import { ShoppingListModule } from './module/shopping-list/shopping-list.module';
import { AdminModule } from './module/admin/admin.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { User } from './entities/user.entity';
import { ConfirmCode } from './entities/confirmCode';
import { Product } from './entities/product.entity';
import { ShoppingList } from './entities/shoppingList.entity';
import { Admin } from './entities/admin.entity';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, ConfirmCode, Product, ShoppingList, Admin],
      synchronize: true,
    }),
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
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProductModule,
    ShoppingListModule,
    AdminModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
