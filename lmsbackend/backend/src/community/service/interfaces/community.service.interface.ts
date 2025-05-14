import { MessageDocument } from "src/community/schema/community.schema"

export interface ICommunityService{

    getMessages(courseId:string):Promise<any>
    addTextMessage(courseId:string,userId:string,username:string,content:string):Promise<MessageDocument>
    addImageMessage(courseId:string,userId:string,username:string,image:Buffer):Promise<any>
    deleteMessage(courseId:string,messageId:string,userId:string):Promise<boolean>
    getCommunity(courseId:string):Promise<any>

    getUnreadMessageCountsForUser(userId:string):Promise<Record<string,number>>
    markMessageAsRead(courseId:string,userId:string):Promise<void>
    getMessageCount(courseId:string):Promise<number>
    getUnreadMessageCount(courseId: string, userId: string): Promise<number>;
}