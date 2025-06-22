import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from 'src/entities/product.entity';
import { DataSource } from 'typeorm';
import { CheckTokenAdminMiddleware } from 'src/middlewares/admin.checkToken';
import { JwtService } from 'src/global/gobalJwt';
import { CloudinaryService } from 'src/external/cloudinary/cloudinary.service';
import { CheckTokenUserMiddleware } from 'src/middlewares/user.checkToken';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, JwtService, CloudinaryService],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckTokenAdminMiddleware)
      .forRoutes('product/create', 'product/update')
      .apply(CheckTokenUserMiddleware)
      .forRoutes('product/comment');
  }
  private dataSource: DataSource;
}
