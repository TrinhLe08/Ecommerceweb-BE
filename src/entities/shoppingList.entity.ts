import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { OrderDetailType } from 'src/utils/shopping-list.type';

@Entity({ name: 'shoppinglist' })
export class ShoppingList extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  buyerName: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  phoneNumber: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @Column()
  point: number;

  @Column()
  email: string;

  @Column()
  purchasDate: string;

  @Column()
  status: boolean;

  @Column('json')
  detailOrder: OrderDetailType[];
}
