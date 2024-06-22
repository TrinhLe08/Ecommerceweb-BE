import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from 'src/entities/admin.entity';
import { JwtService } from 'src/global/gobalJwt';
import { CheckTokenAdminMiddleware } from 'src/middlewares/admin.checkToken';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService, JwtService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckTokenAdminMiddleware).forRoutes('admin/all');
  }
  private dataSource: DataSource;
}
