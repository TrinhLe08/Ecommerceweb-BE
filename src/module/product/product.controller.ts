import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Product } from 'src/entities/product.entity';
import { ProductType } from 'src/utils/product.type';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  async getAllProduct(): Promise<ResponseData<Product[]>> {
    try {
      const allProduct = await this.productService.getAll();
      return new ResponseData<Product[]>(
        allProduct,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('all/artwork')
  async getAllArtwork(): Promise<ResponseData<Product[]>> {
    try {
      const allProduct = await this.productService.getAll();
      const allArwork = allProduct.filter((product: ProductType) => {
        return product.item === 'artwork';
      });
      return new ResponseData<Product[]>(
        allArwork,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('all/holiday')
  async getAllHoliday(): Promise<ResponseData<Product[]>> {
    try {
      const allProduct = await this.productService.getAll();
      const allHoliday = allProduct.filter((product: ProductType) => {
        return product.item === 'holiday';
      });
      return new ResponseData<Product[]>(
        allHoliday,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('all/interior')
  async getAllInterior(): Promise<ResponseData<Product[]>> {
    try {
      const allProduct = await this.productService.getAll();
      const allInterior = allProduct.filter((product: ProductType) => {
        return product.item === 'interior';
      });
      return new ResponseData<Product[]>(
        allInterior,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('all/kitchen')
  async getAllKitchen(): Promise<ResponseData<Product[]>> {
    try {
      const allProduct = await this.productService.getAll();
      const allKitchen = allProduct.filter((product: ProductType) => {
        return product.item === 'kitchen';
      });
      return new ResponseData<Product[]>(
        allKitchen,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('all/sale')
  async getAllSale(): Promise<ResponseData<Product[]>> {
    try {
      const allProduct = await this.productService.getAll();
      const allKitchen = allProduct.filter((product: ProductType) => {
        return product.status === false;
      });
      return new ResponseData<Product[]>(
        allKitchen,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('detail/:id')
  async getDetailProduct(
    @Param('id') id: number,
  ): Promise<ResponseData<Product>> {
    try {
      const detailProduct = await this.productService.findOne(id);
      return new ResponseData<Product>(
        detailProduct,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
  // Cần chỉnh sửa upload file
  @Post('create')
  async createProduct(
    @Body() product: ProductType,
  ): Promise<ResponseData<Product>> {
    try {
      const newProduct = await this.productService.create(product);
      return new ResponseData<Product>(
        newProduct,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
  // Cần chỉnh sửa upload file
  @Post('update')
  async updateDetailProduct(
    @Body() newProduct: Product,
  ): Promise<ResponseData<Product | string>> {
    const { id, ...newPorductToUpdate } = newProduct;
    try {
      const product = await this.productService.findOne(id);
      if (product) {
        const updatePorduct = await this.productService.update(
          id,
          newPorductToUpdate,
        );
        return new ResponseData<Product>(
          updatePorduct,
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      } else {
        return new ResponseData<string>(
          'Product not found',
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      }
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete('/remove/:id')
  async deleteProduct(@Param('id') id: number): Promise<ResponseData<Product>> {
    try {
      await this.productService.remove(id);
      const allProduct = await this.productService.getAll();
      return new ResponseData<Product>(
        allProduct,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
