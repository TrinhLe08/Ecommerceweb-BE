import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { ShoppingList } from 'src/entities/shoppingList.entity';
import { ShoppingListType } from 'src/utils/shopping-list.type';
import { RabbitMQService } from 'src/external/rabbitMQ/rabbitmq.service';
import { CartItem, RedisService } from 'src/external/redis/redis.service';

@Controller('/shopping-list')
export class ShoppingListController {
  constructor(
    private readonly shoppingListService: ShoppingListService,
    private readonly rabbitMQService: RabbitMQService,
    private readonly redisService: RedisService
  ) { }

  @Get('all')
  async getAllOrder(): Promise<ResponseData<ShoppingList[]>> {
    try {
      const allOrder = await this.shoppingListService.getAll();
      return new ResponseData<ShoppingList[]>(
        allOrder,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      return new ResponseData<null>([], HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post('create')
  async createOrder(
    @Body() order: ShoppingListType,
  ): Promise<ResponseData<ShoppingList | any>> {
    try {
      if (order) {
        await this.rabbitMQService.sendToQueue('order_processing', order)
        return new ResponseData<ShoppingList | boolean | any>(
          true,
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      } else {
        return new ResponseData<ShoppingList | boolean | any>(
          false,
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
      }
    } catch (err) {
      return new ResponseData<null>([], HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post('user-oders')
  async getOrderUser(
    @Body() emailUser: { email: string },
  ): Promise<ResponseData<ShoppingList[]>> {
    try {
      const allOrder = await this.shoppingListService.findAllByEmail(
        emailUser.email,
      );
      return new ResponseData<ShoppingList[]>(
        allOrder,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err, "FROM getOrderUser");
      return new ResponseData<null>([], HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete('remove/:id')
  async getDeleteOrder(
    @Param('id') id: number,
  ): Promise<ResponseData<ShoppingList>> {
    try {
      await this.shoppingListService.remove(id);
      const allOrder = await this.shoppingListService.getAll();
      return new ResponseData<ShoppingList>(
        allOrder,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>([], HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Put('update/:id')
  async updateOrder(
    @Body() newOrder: ShoppingListType,
    @Param('id') idOrder: number,
  ): Promise<ResponseData<ShoppingList>> {
    try {
      if (idOrder && newOrder) {
        await this.shoppingListService.update(idOrder, newOrder);
        const allOrder = await this.shoppingListService.getAll();
        return new ResponseData<ShoppingList>(
          allOrder,
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      } else {
        return new ResponseData<null>(
          null,
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
      }
    } catch (err) {
      console.log(err);
      return new ResponseData<null>([], HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('cart/:userId')
  async getAllCart(@Param('userId') userId: string): Promise<ResponseData<CartItem[]>> {
    try {
      const allCart: CartItem[] = await this.redisService.getCart(userId);
      return new ResponseData<CartItem[]>(
        allCart,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      return new ResponseData<null>([], HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
