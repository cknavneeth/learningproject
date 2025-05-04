import { QuizDocument } from "src/quiz/schema/quiz.schema"

export interface IQuizService{
    generateQuestions(topic:string):Promise<any>
    submitQuiz(
        quizId:string,
        userId:string,
        topic:string,
        answers:number[],
        questions:any[]
    ):Promise<any>,
    getQuizHistory(userId:string):Promise<any>
    loadQuiz():Promise<any>
    deleteQuiz(quizId:string):Promise<QuizDocument>
}