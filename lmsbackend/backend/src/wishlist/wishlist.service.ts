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


    async getWishlist(userId:string){
        let wishlist=await this.wishlistRepository.findByUser(userId)
        if(!wishlist){
            wishlist=await this.wishlistRepository.create(userId)
        }
        return wishlist
    }


    async addToWishlist(userId:string,courseId:string){
        console.log('wishlist service')
        const course = await this.courseModel.findById(courseId)
        if (!course) {
            throw new Error('Course not found')
        }
        console.log('course kitti')
        try {
            const wishlist = await this.wishlistRepository.findByUser(userId)
            console.log('Wishlist query result:', wishlist); // Add debug log
    
            if (!wishlist) {
                // If wishlist doesn't exist, create one
                console.log('Creating new wishlist for user:', userId);
                const newWishlist = await this.wishlistRepository.create(userId);
                return this.wishlistRepository.addToWishlist(userId, courseId);
            }
    
            console.log('wishlist kitti')
            const courseExists = wishlist.courses.some(course => course._id.toString() === courseId)
            console.log('courseExists kitti', courseExists)
            
            if (courseExists) {
                throw new Error('Course already in wishlist')
            }
            
            return this.wishlistRepository.addToWishlist(userId, courseId)
        } 
        catch (error) {
            console.error('Error in addToWishlist:', error);
            throw error;
        }
    }



    async removeFromWishlist(userId:string,courseId:string){
        return this.wishlistRepository.removeFromWishlist(userId,courseId)
    }
}
