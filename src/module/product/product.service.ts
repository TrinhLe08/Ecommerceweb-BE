import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductType } from 'src/utils/product.type';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(product: ProductType): Promise<Product> {
    return this.productRepository.save(product);
  }

  async getAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.findOne({ where: { id: id } });
  }

  async update(id: number, newProduct: ProductType): Promise<Product> {
    await this.productRepository.update(id, newProduct);
    return this.productRepository.findOne({ where: { id: id } });
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
