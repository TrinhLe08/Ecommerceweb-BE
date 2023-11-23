import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { UserModule } from './module/user/user.module';
import { ProductModule } from './module/product/product.module';
import { ShoppingListModule } from './module/shopping-list/shopping-list.module';
import { AdminModule } from './module/admin/admin.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { ShoppingList } from './entities/shoppingList.entity';
import { Admin } from './entities/admin.entity';
import { CloudinaryService } from './cloudinary/cloudinary.service';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Product, ShoppingList, Admin],
      synchronize: true,
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
