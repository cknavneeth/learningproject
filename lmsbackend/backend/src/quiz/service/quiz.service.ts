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
    
    
            this.logger.log('Raw response:', response.text);
    
            const sanitizedResponse = response.text!.replace(/```json|```/g, '').trim();
    
            this.logger.log(this.ai,'chat ahneyy')
            
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
        const correctAnswers = questions.reduce((count, question, index) => {
            return question.correctAnswer === answers[index] ? count + 1 : count;
        }, 0);

        if(questions.length===0){
            throw new Error('Questions array cannot be empty')
        }

        const score = (correctAnswers / questions.length) * 100;

       

        const quiz=await this.quizModel.findById(quizId)

        if(!quiz){
            this.logger.log('quiz not found')
            throw new NotFoundException('quiz is not in the collection')
        }

        quiz.userId=new Types.ObjectId(userId)
        quiz.correctAnswers = correctAnswers;
        quiz.score = score;
        quiz.isSubmitted = true;
        quiz.questions = quiz.questions.map((q, i) => ({
        ...q,
        userAnswer: answers[i]
    }));

        await quiz.save();

        if(score>80){
            let user=await this.userModel.findById(userId)

            if(!user){
                this.logger.log('no user found')
                throw new NotFoundException('There is no user to provide score')
            }

            user.wallet+=50

            await user.save()
            
        }

        return quiz
    }

    async getQuizHistory(userId: string) {
        const user = new Types.ObjectId(userId);
        const result = await this.quizModel.find({ userId });
        return result;
    }
}
