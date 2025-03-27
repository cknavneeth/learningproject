import {user, userDocument } from "../users.schema";

export interface IUserRepository{
    findById(userId:string):Promise<userDocument|null>;
    // updateProfile(userId:string,updatedData:Partial<user>):Promise<void>
    // updatePassword(userId:string,hashedpassword:string):Promise<void>
}