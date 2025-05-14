import { IsNotEmpty, IsString, MinLength } from "class-validator";

 

 export class InstructorReplyDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(5,{message:'Reply must be atleast 5 characters long'})
     instructorReply:string    
 }