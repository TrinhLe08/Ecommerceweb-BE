import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtService } from 'src/global/gobalJwt';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { AdminService } from './admin.service';
import { Admin } from 'src/entities/admin.entity';
import { AdminType } from 'src/utils/amdin.type';

@Controller('/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('all')
  async getAllAdmin(): Promise<ResponseData<Admin[]>> {
    try {
      const allAdmin = await this.adminService.getAll();
      return new ResponseData<Admin[]>(
        allAdmin,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err, 'getAllAdmin');
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post('login')
  async loginAdmin(
    @Body() dataLoginAdmin: AdminType,
  ): Promise<ResponseData<string>> {
    try {
      const informationAdmin = await this.adminService.login(
        dataLoginAdmin.name,
      );
      const encodePassword: any = this.jwtService.verify(
        informationAdmin.password,
      );
      if (
        informationAdmin &&
        encodePassword.password === dataLoginAdmin.password
      ) {
        const token: string = jwt.sign(
          {
            name: informationAdmin.name,
            password: informationAdmin.password,
          },
          'key',
        );
        return new ResponseData<string>(
          token,
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      }
    } catch (err) {
      console.log(err, 'loginAdmin');
      return new ResponseData<null>(
        null,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    }
  }

  @Post('create')
  async createAdmin(@Body() admin: AdminType): Promise<ResponseData<Admin>> {
    try {
      const encodePassword: string = this.jwtService.sign({
        password: admin.password,
      });
      const newAdmin = await this.adminService.create({
        name: admin.name,
        password: encodePassword,
      });
      return new ResponseData<Admin>(
        newAdmin,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err, 'createAdmin');
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
