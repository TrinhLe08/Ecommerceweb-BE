import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { CheckTokenUserMiddleware } from 'src/middlewares/user.checkToken';
import { JwtService } from 'src/global/gobalJwt';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, JwtService, CloudinaryService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckTokenUserMiddleware)
      .forRoutes('user/all', 'user/delete/:id', 'user/detail/:id');
  }
  private dataSource: DataSource;
}
