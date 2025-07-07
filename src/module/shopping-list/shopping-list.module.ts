import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ShoppingListController } from './shopping-list.controller';
import { ShoppingListService } from './shopping-list.service';
import { UserService } from '../user/user.service';
import { ShoppingList } from 'src/entities/shoppingList.entity';
import { CheckTokenAdminMiddleware } from 'src/middlewares/admin.checkToken';
import { JwtService } from 'src/global/gobalJwt';
import { User } from 'src/entities/user.entity';
import { MailService } from 'src/external/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShoppingList]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ShoppingListController],
  providers: [ShoppingListService, UserService, JwtService, MailService],
})
export class ShoppingListModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckTokenAdminMiddleware)
      .forRoutes('shopping-list/all', 'shopping-list/remove/:id');
  }
  private dataSource: DataSource;
}
