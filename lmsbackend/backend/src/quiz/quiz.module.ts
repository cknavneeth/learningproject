import { Module } from '@nestjs/common';
import { QuizController } from './controller/quiz.controller';
import { QuizService } from './service/quiz.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './schema/quiz.schema';
import { UsersModule } from 'src/users/users.module';
import { QUIZ_SERVICE } from './constants/quiz.constant';
import { AuthenticationModule } from 'src/authentication/auth.module';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Quiz.name,schema:QuizSchema}]),
        UsersModule,
        AuthenticationModule
    ],
   
    providers: [
        {
            provide:QUIZ_SERVICE,
            useClass:QuizService
        }
    ],
    controllers: [QuizController],
    exports:[QUIZ_SERVICE]
})
export class QuizModule {}
