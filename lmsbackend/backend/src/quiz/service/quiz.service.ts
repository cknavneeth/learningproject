import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Quiz, QuizDocument } from '../schema/quiz.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Replace with the actual Gemini SDK import
import { GoogleGenAI } from '@google/genai';
import { IQuizService } from './interfaces/quiz.service.interface';
import { user, userDocument } from 'src/users/users.schema';

@Injectable()
export class QuizService implements IQuizService{

    private logger=new Logger(QuizService.name)


    private ai: GoogleGenAI;

    constructor(
        private readonly configService: ConfigService,
        @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
        @InjectModel(user.name) private userModel:Model<userDocument>
    ) {
        this.ai = new GoogleGenAI({
            apiKey: this.configService.get<string>('GEMINI_API_KEY'), 
        });
    }


    

    async generateQuestions(topic: string) {
        console.log('service il ethi for quiz')

        this.logger.log(this.ai,'gemini')
        const prompt = `Generate 5 multiple questions about the topic ${topic}.
        Format the output as a JSON array like:
        {
            "questions": [
                {
                    "question": "question text",
                    "options": ["option1", "option2", "option3", "option4"],
                    "correctAnswer": 0
                }
            ]
        }`;


        try {
            
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.0-flash', 
                contents: prompt,
            });
    
    
    
            const sanitizedResponse = response.text!.replace(/```json|```/g, '').trim();
    
            
            
            const {questions} = JSON.parse(sanitizedResponse);
    
            const quiz=new this.quizModel({
                
                topic,
                score:0,
                totalQuestions: questions.length,
                correctAnswers:0,
                questions: questions.map((q, i) => ({
                    ...q,
                    userAnswer:null,
                })),
            })
    
            const savedQuiz=await quiz.save()

            this.logger.log('quiz saved heehhehhe',savedQuiz)
    
            return{
               quizId: savedQuiz._id,
               questions:savedQuiz.questions
            }
        } catch (error) {
            if(error.message.includes('503')){
                this.logger.error('The AI model is overloaded,Please try again later')
                throw new Error('The AI model is Overloaded')
            }else{
                this.logger.log('error in quiz service',error)
            }
        }

       
        
    }

    async submitQuiz(
        quizId:string,
        userId: string,
        topic: string,
        answers: number[],
        questions: any[]
    ) {

        const existingSubmission=await this.quizModel.findOne({
            originalQuizId:quizId,
            userId:new Types.ObjectId(userId),
            isSubmitted:true
        })

        if(existingSubmission){
            this.logger.error(`User ${userId} has already submitted quiz ${quizId}`);
            throw new Error('You have already submitted this quiz');
        }
        


        const correctAnswers = questions.reduce((count, question, index) => {
            return question.correctAnswer === answers[index] ? count + 1 : count;
        }, 0);

        if(questions.length===0){
            throw new Error('Questions array cannot be empty')
        }

        const score = (correctAnswers / questions.length) * 100;


        const originalQuiz=await this.quizModel.findById(quizId)

        if(!originalQuiz){
            this.logger.error(`Quiz not found with ID: ${quizId}`);
            throw new NotFoundException('quiz is not in the collection');
        }


        this.logger.log(`Quiz found, updating with user answers`);

        const userQuizSubmission=new this.quizModel({
            userId: new Types.ObjectId(userId),
            topic: originalQuiz.topic,
            score: score,
            totalQuestions: questions.length,
            correctAnswers: correctAnswers,
            isSubmitted: true,
            questions: originalQuiz.questions.map((q, i) => ({
                ...q,
                userAnswer: answers[i]
            })),
            originalQuizId: quizId
        })

        const savedSubmission=await userQuizSubmission.save();

        if(score>80){
            let user=await this.userModel.findById(userId)

            if(!user){
                this.logger.log('no user found')
                throw new NotFoundException('There is no user to provide score')
            }

            user.wallet+=50

            await user.save()
            
        }

        return savedSubmission
    }

    async getQuizHistory(userId: string) {
        const userObjectId = new Types.ObjectId(userId);
        const result = await this.quizModel.find({
             userId :userObjectId,
             isSubmitted:true
            })
        return result;
    }



    async loadQuiz(){
        const result=await this.quizModel.find({userId:{$exists:false}})
        .select('questions topic _id isSubmitted')
        return result
    }
}
