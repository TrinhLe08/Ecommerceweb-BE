import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from 'src/entities/admin.entity';
import { AdminType } from 'src/utils/amdin.type';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async create(admin: AdminType): Promise<Admin> {
    return this.adminRepository.save(admin);
  }

  async getAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async findOne(id: number): Promise<Admin> {
    return this.adminRepository.findOne({ where: { id: id } });
  }

  async login(name: string): Promise<Admin> {
    return this.adminRepository.findOne({ where: { name: name } });
  }

  async update(id: number, newAdmin: AdminType): Promise<Admin> {
    await this.adminRepository.update(id, newAdmin);
    return this.adminRepository.findOne({ where: { id: id } });
  }

  async remove(id: number): Promise<void> {
    await this.adminRepository.delete(id);
  }
}
