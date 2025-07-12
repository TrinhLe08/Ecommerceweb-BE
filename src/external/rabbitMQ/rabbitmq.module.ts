import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  imports: [ConfigModule], // Thêm ConfigModule vào imports
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}