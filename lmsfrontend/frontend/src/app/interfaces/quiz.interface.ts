export interface QuizQuestion{
    question:string
    options:string[]
    correctAnswer:number
    userAnswer?:number|null
    topic?:string
}

export interface QuizGenerateResponse{
    quizId:string
    questions:QuizQuestion[]
}

export interface Quiz{
    _id:string
    topic:string
    questions:QuizQuestion[]
    score?:number
    totalQuestions:number
    correctAnswers?:number
    isSubmitted?:boolean
    createdAt?:Date
    updatedAt?:Date
}

export interface QuizSubmitRequest{
    quizId:string;
    topic:string
    answers:number[]
    questions:QuizQuestion[]
}

export interface QuizSubmitResponse{
    _id:string
    score:number
    totalQuestions:number
    correctAnswers:number
    isSubmitted:boolean
    questions:QuizQuestion[]
}

export interface QuizDeleteResponse{
    success:boolean
    message:string
}