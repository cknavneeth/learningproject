import {instructor,instructorDocument} from "../instructor.schema";

export interface IInstructorRepository{
    findById(instructorId:string):Promise<instructorDocument|null>;
    updateProfile(instructorId:string,profileData:Partial<instructor>):Promise<instructorDocument>
    updatePassword(instructorId:string,hashedpassword:string):Promise<void>
    updateReapplyStatus(instructorId:string,canReapply:boolean):Promise<instructorDocument>
}