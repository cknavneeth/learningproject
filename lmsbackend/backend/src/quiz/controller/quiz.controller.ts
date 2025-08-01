import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Logger, Param, Post, Req, UseGuards } from '@nestjs/common';
import { QuizService } from '../service/quiz.service';
import { QUIZ_SERVICE } from '../constants/quiz.constant';
import { IQuizService } from '../service/interfaces/quiz.service.interface';
import { GuardGuard } from 'src/authentication/guard/guard.guard';

@Controller('quiz')
export class QuizController {

    private logger=new Logger(QuizController.name)

    constructor(
        @Inject(QUIZ_SERVICE) private readonly _quizService:IQuizService,
    ){}


    @Post('generate')
    async generateQuiz(@Body() body:{topic:string}){
        console.log('topic',body.topic)
        try {
            const result=await this._quizService.generateQuestions(body.topic)
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
        const result=await this._quizService.submitQuiz(
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
            const result=await this._quizService.getQuizHistory(userId)
            return result
        } catch (error) {
            
        }
      

    }


    @Get('history')
    async loadQuiz(){
        try {
            const result=await this._quizService.loadQuiz()
            return result
        } catch (error) {
            this.logger.log('error',error)
            throw error
        }
    }


    @Delete(':quizId')
    async deleteQuiz(@Param('quizId') quizId:string){
        try {
            const result=await this._quizService.deleteQuiz(quizId)
            return {success:true,message:'Quiz deleted successfully'}
        } catch (error) {
            this.logger.error('Error deleting quiz',error)
            throw new HttpException('failed to delete quiz',HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


}
