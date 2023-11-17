import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseData } from 'src/global/globalClass';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { User } from '../../entities/user.entity';
import { UserType } from 'src/utils/user.type';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async getAllUser(): Promise<ResponseData<User[]>> {
    try {
      const allUser = await this.userService.getAll();
      return new ResponseData<User[]>(
        allUser,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Get('detail/:id')
  async getdetailUser(@Param('id') id: number): Promise<ResponseData<User>> {
    try {
      const detailUser = await this.userService.findOne(id);
      return new ResponseData<User>(
        detailUser,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Post('create')
  async createUser(
    @Body() user: UserType,
  ): Promise<ResponseData<User | string>> {
    try {
      const allUser = await this.userService.getAll();
      const existingUser = allUser.find((u) => u.email === user.email);
      if (existingUser) {
        return new ResponseData<string>(
          'Email already exists',
          HttpStatus.SUCCESS,
          HttpMessage.SUCCESS,
        );
      }
      const newUser = await this.userService.create(user);
      return new ResponseData<User>(
        newUser,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }

  @Delete('delete/:id')
  async getdeleteUser(@Param('id') id: number): Promise<ResponseData<User>> {
    try {
      await this.userService.remove(id);
      const allUser = await this.userService.getAll();
      return new ResponseData<User>(
        allUser,
        HttpStatus.SUCCESS,
        HttpMessage.SUCCESS,
      );
    } catch (err) {
      console.log(err);
      return new ResponseData<null>(null, HttpStatus.ERROR, HttpMessage.ERROR);
    }
  }
}
