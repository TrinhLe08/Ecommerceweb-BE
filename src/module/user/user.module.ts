import {
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfirmCode } from 'src/entities/confirmCode';
import { User } from '../../entities/user.entity';
import { CheckTokenUserMiddleware } from 'src/middlewares/user.checkToken';
import { JwtService } from 'src/global/gobalJwt';
import { CloudinaryService } from 'src/external/cloudinary/cloudinary.service';
import { ConfirmCodeService } from './confirm-code.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([ConfirmCode]),
  ],
  controllers: [UserController],
  providers: [UserService, ConfirmCodeService, JwtService, CloudinaryService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckTokenUserMiddleware)
      .forRoutes('user/delete/:id', 'user/detail/:id');
  }
  private dataSource: DataSource;
}
