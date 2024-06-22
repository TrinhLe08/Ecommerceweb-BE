import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListService } from './shopping-list.service';
import { UserService } from '../user/user.service';
import { ShoppingList } from 'src/entities/shoppingList.entity';
import { CheckTokenAdminMiddleware } from 'src/middlewares/admin.checkToken';
import { JwtService } from 'src/global/gobalJwt';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingList]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ShoppingListController],
  providers: [ShoppingListService, UserService, JwtService],
})
export class ShoppingListModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckTokenAdminMiddleware)
      .forRoutes('shoppingList/all', 'shoppingList/remove/:id');
  }
  private dataSource: DataSource;
}
