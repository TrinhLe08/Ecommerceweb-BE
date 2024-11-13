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
import { UserService } from '../user/user.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { ShoppingList } from 'src/entities/shoppingList.entity';
import { ShoppingListType } from 'src/utils/shopping-list.type';
import { MailerService } from '@nestjs-modules/mailer';
import { log } from 'handlebars';

@Controller('/shopping-list')
export class ShoppingListController {
  constructor(
    private readonly shoppingListService: ShoppingListService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

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
      const userInformation = await this.userService.findByEmail(order.email);
      if (userInformation) {
        userInformation.point = userInformation.point - order.point + 5;
        userInformation.spent = userInformation.spent + order.price;
        order.detailOrder.forEach((o) => {
          userInformation.bought.push(o.idOrder);
        });
        userInformation.bought = Array.from(new Set(userInformation.bought));
        await this.userService.update(userInformation.id, userInformation);
        const dataUser = {
          id: userInformation.id,
          email: userInformation.email,
          bought: userInformation.bought,
          urlAvatar: userInformation.urlAvatar,
        };
        const newOrder = await this.shoppingListService.create(order);
        if (newOrder) {
          this.mailerService
            .sendMail({
              to: newOrder.email,
              subject: 'Thank you for shopping at LEIF SHOP.',
              template: './pay-ment',
              context: {
                name: newOrder.buyerName,
              },
            })
            .then(() => {
              console.log('Email sent successfully');
            })
            .catch((error) => {
              console.error('Failed to send email:', error);
            });
          return new ResponseData<ShoppingList | boolean | any>(
            dataUser,
            HttpStatus.SUCCESS,
            HttpMessage.SUCCESS,
          );
        } else {
          return new ResponseData<ShoppingList | boolean>(
            false,
            HttpStatus.SUCCESS,
            HttpMessage.SUCCESS,
          );
        }
      } else {
        const newOrder = await this.shoppingListService.create(order);
        if (newOrder) {
          this.mailerService
            .sendMail({
              to: newOrder.email,
              subject: 'Thank you for shopping at LEIF SHOP.',
              template: './pay-ment',
              context: {
                name: newOrder.buyerName,
              },
            })
            .then(() => {
              console.log('Email sent successfully');
            })
            .catch((error) => {
              console.error('Failed to send email:', error);
            });
          return new ResponseData<ShoppingList | boolean | any>(
            {},
            HttpStatus.SUCCESS,
            HttpMessage.SUCCESS,
          );
        } else {
          return new ResponseData<ShoppingList | boolean>(
            false,
            HttpStatus.ERROR,
            HttpMessage.ERROR,
          );
        }
      }
    } catch (err) {
      console.log(err);
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
}
