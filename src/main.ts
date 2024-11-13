declare const module: any;
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 10000;
  app.enableCors({
    origin: process.env.URL_FRONTEND,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
