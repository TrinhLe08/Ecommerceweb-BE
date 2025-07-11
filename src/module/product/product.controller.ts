import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CloudinaryService } from 'src/external/cloudinary/cloudinary.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { Product } from 'src/entities/product.entity';
import { ProductType, UserComment } from 'src/utils/product.type';


@Controller('/product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
      return new ResponseData<null>([], HttpStatus.ERROR, HttpMessage.ERROR);
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
        return product.status === true;
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

  @Post('create')
  @UseInterceptors(FileInterceptor('urlProduct'))
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() product: Product | any,
  ): Promise<ResponseData<Product | string>> {
    try {
      const ProductUrl = await this.cloudinaryService.uploadFile(file);
      const productDataToCreate = {
        urlProduct: ProductUrl.url,
        ...product,
        comment: [],
      };
      productDataToCreate.price = Number(productDataToCreate.price);
      productDataToCreate.ratting = Number(productDataToCreate.ratting);
      if (typeof productDataToCreate.status === 'string') {
          productDataToCreate.status = JSON.parse(productDataToCreate.status.toLowerCase());
         } else {
          productDataToCreate.status = Boolean(productDataToCreate.status);
        }
      const newProduct = await this.productService.create(productDataToCreate);
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

  @Post('update')
  @UseInterceptors(FileInterceptor('urlProduct'))
  async updateDetailProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() newProduct: Product | any,
  ): Promise<ResponseData<Product | string>> {
    try {
      if (file) {
        const { id, ...newProductToUpdate } = newProduct;
                console.log(newProduct,192);
        const ProductUrl = await this.cloudinaryService.uploadFile(file);
        const product = await this.productService.findOne(id);
        const dataToUpdate: ProductType = {
          detail: newProductToUpdate.detail,
          item: newProductToUpdate.item,
          name: newProductToUpdate.name,
          ratting: product.ratting,
          urlProduct: ProductUrl.url,
          origin: newProductToUpdate.origin,
          price: newProductToUpdate.price,
          size: newProductToUpdate.size,
          status: JSON.parse(newProductToUpdate.status.toLowerCase()),
          material: newProductToUpdate.material,
          comment: newProductToUpdate.comment,
        };
        if (product) {
          const updatePorduct = await this.productService.update(
            id,
            dataToUpdate,
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
      } else {
        const { id, ...newProductToUpdate } = newProduct
        console.log(newProductToUpdate,222);
        
       if (typeof newProductToUpdate.status === 'string') {
          newProductToUpdate.status = JSON.parse(newProductToUpdate.status.toLowerCase());
         } else {
          newProductToUpdate.status = Boolean(newProductToUpdate.status);
        }
        console.log(newProductToUpdate,227)
        const product = await this.productService.findOne(id)
        if (product) {
          const updatePorduct = await this.productService.update(
            id,
            newProductToUpdate,
          );
          console.log(updatePorduct, 234);
          
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
      }
    } catch (err) {
      console.log(err);
      return new ResponseData<string>(
        err,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    }
  }

  @Post('comment') async CommentProduct(
    @Body() content: { idProduct: number; data: UserComment },
  ): Promise<ResponseData<Product | any>> {
    try {
      const productDetail = await this.productService.findOne(
        content.idProduct,
      );
      productDetail.comment.push(content.data);
      const sumRatting = productDetail.comment.reduce(
        (acc, obj: UserComment) => acc + obj.ratting,
        0,
      );
      productDetail.ratting = sumRatting / productDetail.comment.length;

      const updateComment = await this.productService.update(
        productDetail.id,
        productDetail,
      );
      return new ResponseData<Product>(
        updateComment,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<string>(
        err,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
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
