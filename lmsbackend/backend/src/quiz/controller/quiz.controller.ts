import { Body, Controller, Get, Inject, Logger, Param, Post } from '@nestjs/common';
import { QuizService } from '../service/quiz.service';
import { QUIZ_SERVICE } from '../constants/quiz.constant';
import { IQuizService } from '../service/interfaces/quiz.service.interface';

@Controller('quiz')
export class QuizController {

    private logger=new Logger(QuizController.name)

    constructor(
        @Inject(QUIZ_SERVICE) private readonly quizService:IQuizService,
    ){}


    @Post('generate')
    async generateQuiz(@Body() body:{topic:string}){
        console.log('topic',body.topic)
        try {
            const result=await this.quizService.generateQuestions(body.topic)
            return result
        } catch (error) {
            this.logger.log('error',error)
            throw error
        }
       
    }



    @Post('submit')
    async submitQuiz(@Body() body:{
        quizId:string,
        userId:string,
        topic:string,
        answers:number[],
        questions:any[]
    }) {
        const result=await this.quizService.submitQuiz(
            body.quizId,
            body.userId,
            body.topic,
            body.answers,
            body.questions
        )
    }


    @Get('history/:userId')
    async getQuizHistory(@Param('userId') userId:string){

        try {
            const result=await this.quizService.getQuizHistory(userId)
            return result
        } catch (error) {
            
        }
      

    }


}
