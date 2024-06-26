import { UserComment } from 'src/utils/product.type';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({ name: 'allproduct' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  urlProduct: string;

  @Column()
  name: string;

  @Column()
  ratting: number;

  @Column()
  price: number;

  @Column()
  status: boolean;

  @Column()
  material: string;

  @Column()
  size: string;

  @Column()
  detail: string;

  @Column()
  origin: string;

  @Column()
  item: string;

  @Column('json')
  comment: UserComment[];
}
