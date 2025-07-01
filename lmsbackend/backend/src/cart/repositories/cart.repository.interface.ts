import { CartDocument } from "../cart.schema";

export interface ICartRepository{
    findByUser(userId:string):Promise<CartDocument|null>
    create(userId:string):Promise<CartDocument>
    addItem(userId:string,courseId:string):Promise<CartDocument|null>
    removeItem(userId:string,courseId:string):Promise<CartDocument|null>
    clearCart(userId:string):Promise<CartDocument>
    findUserById(userId:string):Promise<CartDocument>
}