import { Injectable } from '@nestjs/common';
import { WishlistRepository } from './repositories/wishlist/wishlist.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'src/instructors/courses/course.schema';
import { Model } from 'mongoose';

@Injectable()
export class WishlistService {
    constructor(private readonly wishlistRepository:WishlistRepository,
        @InjectModel(Course.name) private courseModel:Model<Course> 
    ){}


    // async getWishlist(userId:string){
    //     let wishlist=await this.wishlistRepository.findByUser(userId)
    //     if(!wishlist){
    //         wishlist=await this.wishlistRepository.create(userId)
    //     }
    //     return wishlist
    // }
}
