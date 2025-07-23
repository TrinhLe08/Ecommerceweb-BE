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
import { CloudinaryModule } from './external/cloudinary/cloudinary.module';
import { User } from './entities/user.entity';
import { ConfirmCode } from './entities/confirmCode';
import { Product } from './entities/product.entity';
import { ShoppingList } from './entities/shoppingList.entity';
import { Admin } from './entities/admin.entity';
import { CloudinaryService } from './external/cloudinary/cloudinary.service';
import { MailModule } from './external/mail/mail.module';
import { ThrottlerModule, ThrottlerGuard   } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core'
import { RabbitMQModule } from './external/rabbitMQ/rabbitmq.module';
import { AuthModule } from './module/auth/auth.module';
import { AuthController } from './module/auth/auth.controller';
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
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60000,  //60s
        limit: 100,
      }]
    }),
    MailModule,
    UserModule,
    ProductModule,
    ShoppingListModule,
    AdminModule,
    CloudinaryModule,
    RabbitMQModule,
    AuthModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, CloudinaryService, {
      provide: APP_GUARD,
      useClass: ThrottlerGuard ,
    },
],
 exports: [RabbitMQModule],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
