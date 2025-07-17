import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { AmqpConnectionManager, ChannelWrapper, connect } from 'amqp-connection-manager';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private connection: AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;
  private isInitialized = false;
  private initPromise: Promise<void>;

  constructor(private readonly configService: ConfigService) {
        this.initPromise = this.Connect();
  }

  async onModuleInit() {
      await this.Connect();
  }

  async waitForInit(): Promise<void> {
    if (!this.isInitialized) {
      await this.initPromise;
    }
  }

private async Connect() {
    const url = this.configService.get<string>('RABBIT_MQ_URL');
    this.connection = connect([url]);

    this.channelWrapper = this.connection.createChannel({
      json: true, // Tự động parse JSON
      setup: (channel: amqp.Channel) => {
        return channel.assertQueue('my_queue', { durable: true });
      },
    });

    await this.channelWrapper.waitForConnect();
    this.isInitialized = true;
    console.log('RabbitMQ connected!');
}

async sendToQueue(
  queue: string,
  message: any,
  maxRetries: number = 3,
  retryDelay: number = 1000
) {
  if (!this.isInitialized) throw new Error('RabbitMQ not ready');

  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
    await this.channelWrapper.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true
    } as any);
      return;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed for ${queue}:`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}

async consumeReceiveToQueue(queue: string, callback: (msg: any) => void) {
  await this.waitForInit();
      if (!this.channelWrapper) {
      throw new Error('RabbitMQ channel not initialized');
    }
  try {
    await this.channelWrapper.addSetup(async (channel: amqp.Channel) => {
      await channel.assertQueue(queue, {
        durable: true, 
        arguments: {
          'x-queue-type': 'classic' 
        }
      });
      return channel.consume(queue, (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          callback(content);
          channel.ack(message);
        }
      });
    });
  } catch (error) {
    console.error(`Error setting up consumer for queue ${queue}:`, error);
    throw error;
  }
}
}