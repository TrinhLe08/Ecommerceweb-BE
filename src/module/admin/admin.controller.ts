import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtService } from 'src/global/gobalJwt';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { AdminService } from './admin.service';
import { Admin } from 'src/entities/admin.entity';
import { AdminType } from 'src/utils/amdin.type';
import { log } from 'handlebars';

@Controller('/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) { }

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

      if (dataLoginAdmin.email && dataLoginAdmin.password) {
        const informationAdmin = await this.adminService.login(
          dataLoginAdmin.email,
        );
        if (
          informationAdmin
        ) {
          const token: string = jwt.sign(
            {
              name: informationAdmin.email,
              password: informationAdmin.password,
              role: 'admin',
            },
            'key',
          );

          return new ResponseData<string>(
            token,
            HttpStatus.SUCCESS,
            HttpMessage.SUCCESS,
          );
        }
      } else {
        return new ResponseData<string>(
          'Lack of information',
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
      }
    } catch (err) {
      console.log(err, 'FROM loginAdmin');
      return new ResponseData<null>(
        null,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    }
  }

  @Post('check-token-admin')
  async checkTokenAdmin(
    @Body() tokenCheck: any,
  ): Promise<ResponseData<boolean>> {
    const token: string = tokenCheck.tokenCheck;
    if (!token) {
      return new ResponseData<boolean>(
        false,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
    try {
      const informationAamdin: any = this.jwtService.verify(token);
      if (informationAamdin.role === 'admin') {
        return new ResponseData<boolean>(
          true,
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      } else {
        return new ResponseData<boolean>(
          false,
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
      }
      return;
    } catch (err) {
      console.log(err);
      return new ResponseData<boolean>(
        false,
        HttpStatus.ERROR,
        HttpMessage.ERROR,
      );
    }
  }

  @Post('create')
  async createAdmin(
    @Body() admin: AdminType,
  ): Promise<ResponseData<Admin | string>> {
    try {
      if (admin.email && admin.password) {
        const encodePassword: string = this.jwtService.sign({
          password: admin.password,
        });
        const newAdmin = await this.adminService.create({
          email: admin.email,
          password: encodePassword,
        });
        return new ResponseData<Admin>(
          newAdmin,
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      } else {
        return new ResponseData<string>(
          'Lack of information',
          HttpStatus.ERROR,
          HttpMessage.ERROR,
        );
      }
    } catch (err) {
      console.log(err, 'createAdmin');
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
