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
import {
  OrderDetailType,
  ShoppingListType,
} from 'src/utils/shopping-list.type';

@Controller('/shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

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
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post('create')
  async createOrder(
    @Body() order: ShoppingListType,
  ): Promise<ResponseData<ShoppingList>> {
    try {
      const newOrder = await this.shoppingListService.create(order);
      return new ResponseData<ShoppingList>(
        newOrder,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
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
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
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
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
