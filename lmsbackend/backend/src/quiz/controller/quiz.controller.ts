import { Body, Controller, Get, Inject, Logger, Param, Post, Req, UseGuards } from '@nestjs/common';
import { QuizService } from '../service/quiz.service';
import { QUIZ_SERVICE } from '../constants/quiz.constant';
import { IQuizService } from '../service/interfaces/quiz.service.interface';
import { GuardGuard } from 'src/authentication/guard/guard.guard';

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
    @UseGuards(GuardGuard)
    async submitQuiz(@Req() req,@Body() body:{
        quizId:string,
        topic:string,
        answers:number[],
        questions:any[]
    }) {

       

        const userId=req.user.userId

        this.logger.log(`Attempting to submit quiz with ID: ${body.quizId}, userId: ${userId}, topic: ${body.topic}`);
        const result=await this.quizService.submitQuiz(
            body.quizId,
            userId,
            body.topic,
            body.answers,
            body.questions
        )

        return result
    }


    @Get('userHistory')
    @UseGuards(GuardGuard)
    async getQuizHistory(@Req() req){

        try {
            const userId=req.user.userId
            const result=await this.quizService.getQuizHistory(userId)
            return result
        } catch (error) {
            
        }
      

    }


    @Get('history')
    async loadQuiz(){
        try {
            const result=await this.quizService.loadQuiz()
            return result
        } catch (error) {
            this.logger.log('error',error)
            throw error
        }
    }


}
