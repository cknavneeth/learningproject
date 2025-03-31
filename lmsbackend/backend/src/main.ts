import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser())

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });

  console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

  console.log('Server running on port:', process.env.PORT);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
