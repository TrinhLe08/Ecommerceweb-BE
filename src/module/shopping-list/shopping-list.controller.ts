import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { ShoppingList } from 'src/entities/shoppingList.entity';
import { ShoppingListType } from 'src/utils/shopping-list.type';

@Controller('/shopping-list')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Get('all')
  async getAllOrder(): Promise<ResponseData<ShoppingList[]>> {
    try {
      const allUser = await this.shoppingListService.getAll();
      return new ResponseData<ShoppingList[]>(
        allUser,
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
  async getDeleteOrder(@Param('id') id: number): Promise<ResponseData<string>> {
    try {
      await this.shoppingListService.remove(id);
      return new ResponseData<string>(
        'Remove success',
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
