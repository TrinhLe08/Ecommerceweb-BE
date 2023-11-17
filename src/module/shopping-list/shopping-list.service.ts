import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingList } from 'src/entities/shoppingList.entity';
import { ShoppingListType } from 'src/utils/shopping-list.type';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListRepository: Repository<ShoppingList>,
  ) {}

  async create(ShoppingList: ShoppingListType): Promise<ShoppingList> {
    return this.shoppingListRepository.save(ShoppingList);
  }

  async getAll(): Promise<ShoppingList[]> {
    return this.shoppingListRepository.find();
  }

  async findOne(id: number): Promise<ShoppingList> {
    return this.shoppingListRepository.findOne({ where: { id: id } });
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
}
