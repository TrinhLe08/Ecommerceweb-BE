import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfirmCode } from 'src/entities/confirmCode';
import { ConfirmCodeType } from 'src/utils/confirm-code';

@Injectable()
export class ConfirmCodeService {
  constructor(
    @InjectRepository(ConfirmCode)
    private ConfirmCodeRepository: Repository<ConfirmCode>,
  ) { }

  async create(ConfirmCode: ConfirmCodeType): Promise<ConfirmCode> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const confirmCodeWithExpiry = {
      ...ConfirmCode,
      expiresAt,
    };

    return this.ConfirmCodeRepository.save(confirmCodeWithExpiry);
  }

  @Cron(CronExpression.EVERY_HOUR) // Chạy mỗi giờ
  async deleteExpiredCodes() {
    const now = new Date();
    await this.ConfirmCodeRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt <= :now', { now })
      .execute();
  }

  async isValid(code: string): Promise<boolean> {
    const confirmCode = await this.ConfirmCodeRepository.findOne({ where: { code } });
    if (!confirmCode) return false;

    const now = new Date();
    return now <= confirmCode.expiresAt;
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
