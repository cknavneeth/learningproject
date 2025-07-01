import { WishlistDocument } from "../wishlist.schema";


export interface IWishlistRepository{
    findByUser(userId:string):Promise<WishlistDocument|null>
    create(userId:string):Promise<WishlistDocument>
    addToWishlist(userId:string,courseId:string):Promise<WishlistDocument|null>
    removeFromWishlist(userId:string,courseId:string):Promise<WishlistDocument|null>
}