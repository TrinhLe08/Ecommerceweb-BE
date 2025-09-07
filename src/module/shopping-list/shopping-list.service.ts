import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { Repository } from 'typeorm';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { ShoppingList } from 'src/entities/shoppingList.entity';
import { ShoppingListType } from 'src/utils/shopping-list.type';
import { RabbitMQService } from 'src/external/rabbitMQ/rabbitmq.service';
import { UserService } from '../user/user.service';
import { MailService } from 'src/external/mail/mail.service';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListRepository: Repository<ShoppingList>,
    private readonly userService: UserService,
    private readonly mailerService: MailService,
    private readonly rabbitMQService: RabbitMQService,
    private readonly moduleRef: ModuleRef
  ) { }

  async create(ShoppingList: ShoppingListType): Promise<ShoppingList> {
    return this.shoppingListRepository.save(ShoppingList);
  }

  async getAll(): Promise<ShoppingList[]> {
    return this.shoppingListRepository.find();
  }

  async findAllByEmail(email: string): Promise<ShoppingList[]> {
    return this.shoppingListRepository.find({ where: { email: email } });
  }

  async update(
    id: number,
    newShoppingList: ShoppingListType,
  ): Promise<ShoppingList> {
    await this.shoppingListRepository.update(id, newShoppingList);
    return this.shoppingListRepository.findOne({ where: { id: id } });
  }

  async remove(id: number): Promise<void> {
    await this.shoppingListRepository.delete(id);
  }

  async onModuleInit() {
    const rabbitMQService = await this.moduleRef.get(RabbitMQService, { strict: false });
    await rabbitMQService.consumeReceiveToQueue('order_processing', async (msg) => {
      try {
        const buffer = Buffer.from(msg.data)
        const jsonString = buffer.toString('utf-8');
        const objectDataOrder = JSON.parse(jsonString);
        try {
          const userInformation = await this.userService.findByEmail(objectDataOrder.email);
          if (userInformation) {
            userInformation.point = userInformation.point - objectDataOrder.point + 5;
            userInformation.spent = userInformation.spent + objectDataOrder.price;
            objectDataOrder.detailOrder.forEach((o: any) => {
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
            const newOrder = await this.create(objectDataOrder);
            if (newOrder) {
              this.mailerService.sendNotificationPayMent(newOrder.email)
              return new ResponseData<ShoppingList | boolean | any>(
                dataUser,
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
          } else {
            const newOrder = await this.create(objectDataOrder);
            if (newOrder) {
              this.mailerService.sendNotificationPayMent(newOrder.email)
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
          return new ResponseData<null>([], HttpStatus.ERROR, HttpMessage.ERROR);
        }
      } catch (error) {
        console.error('Error processing message FROM createOrder:', error);
        return false;
      }
    },);
    return;
  }
}
