import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserType } from 'src/utils/user.type';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(user: UserType): Promise<User> {
    return this.userRepository.save(user);
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.userRepository.findOne({ where: { phoneNumber: phoneNumber } });
  } 


  createRandomCode(length: number): string {
    const code = crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
    return code;
  }

  async update(id: number, newUser: UserType): Promise<User> {
    await this.userRepository.update(id, newUser);
    return this.userRepository.findOne({ where: { id: id } });
  }

  async updateEmail(id: number, newEmail: string): Promise<User> {
    await this.userRepository.update(id, { email: newEmail });
    return this.userRepository.findOne({ where: { id } });
  }

  async updatePassword(id: number, newPassword: string): Promise<User> {
    await this.userRepository.update(id, { password: newPassword });
    return this.userRepository.findOne({ where: { id: id } });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
