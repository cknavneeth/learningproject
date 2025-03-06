import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });

  console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
