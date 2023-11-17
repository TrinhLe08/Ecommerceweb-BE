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
import { ShoppingList } from 'src/entities/shoppingList.entity';
import { CheckTokenMiddleware } from 'src/middlewares/admin.checkToken';
import { JwtService } from 'src/global/gobalJwt';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingList])],
  controllers: [ShoppingListController],
  providers: [ShoppingListService, JwtService],
})
export class ShoppingListModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckTokenMiddleware)
      .forRoutes('shoppingList/create', 'shoppingList/remove/:id');
  }
  private dataSource: DataSource;
}
