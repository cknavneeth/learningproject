// main file
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';;
import * as express from 'express';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser())

  app.enableCors({
    origin: ['https://navaneethck.online','http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });


  app.use(express.json({limit:'50mb'}))
  app.use(express.urlencoded({limit:'50mb',extended:true}))

  console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

  console.log('Server running on port:', process.env.PORT);

  

  // await app.listen(process.env.PORT ?? 5000);
  await app.listen(process.env.PORT??5000,'0.0.0.0',()=>{
    console.log('Server running on port:', app.getHttpServer().address());
  });
}
bootstrap();
