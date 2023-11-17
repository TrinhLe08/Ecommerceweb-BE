import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { DataSource } from 'typeorm';
import { CheckTokenMiddleware } from 'src/middlewares/admin.checkToken';
import { JwtService } from 'src/global/gobalJwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckTokenMiddleware)
      .forRoutes('user/all', 'user/delete/:id');
  }
  private dataSource: DataSource;
}
