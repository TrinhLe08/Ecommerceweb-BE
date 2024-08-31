import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfirmCode } from 'src/entities/confirmCode';
import { ConfirmCodeType } from 'src/utils/confirm-code';

@Injectable()
export class ConfirmCodeService {
  constructor(
    @InjectRepository(ConfirmCode)
    private ConfirmCodeRepository: Repository<ConfirmCode>,
  ) {}

  async create(ConfirmCode: ConfirmCodeType): Promise<ConfirmCode> {
    return this.ConfirmCodeRepository.save(ConfirmCode);
  }

  async getAll(): Promise<ConfirmCode[]> {
    return this.ConfirmCodeRepository.find();
  }

  async findOneById(id: number): Promise<ConfirmCode> {
    return this.ConfirmCodeRepository.findOne({ where: { id: id } });
  }

  async findCode(code: string): Promise<ConfirmCode> {
    return this.ConfirmCodeRepository.findOne({ where: { code: code } });
  }

  async remove(id: number): Promise<void> {
    await this.ConfirmCodeRepository.delete(id);
  }
}
