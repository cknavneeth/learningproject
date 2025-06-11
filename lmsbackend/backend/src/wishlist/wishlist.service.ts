import { BadRequestException, Injectable } from '@nestjs/common';
import { WishlistRepository } from './repositories/wishlist/wishlist.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'src/instructors/courses/course.schema';
import { Model } from 'mongoose';
import { MESSAGES } from 'src/common/constants/messages.constants';
import { UserRepository } from 'src/users/repositories/user/user.repository';

@Injectable()
export class WishlistService {
    constructor(private readonly wishlistRepository:WishlistRepository,
        @InjectModel(Course.name) private courseModel:Model<Course> ,private readonly userRepository:UserRepository
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

        const user=await this.userRepository.findById(userId)
        if(user){
            if(user.isBlocked){
                throw new BadRequestException('You are blocked')
            }
        }


        const course = await this.courseModel.findById(courseId)
        if (!course) {
            throw new Error('Course not found')
        }
        console.log('course kitti')
        try {
            const wishlist = await this.wishlistRepository.findByUser(userId)
            // console.log('Wishlist query result:', wishlist); 
    
            if (!wishlist) {
                console.log('Creating new wishlist for user:', userId);
                const newWishlist = await this.wishlistRepository.create(userId);
                return this.wishlistRepository.addToWishlist(userId, courseId);
            }
    
            console.log('wishlist kitti')
            const courseExists = wishlist.courses.some(course => course._id.toString() === courseId)
            // console.log('courseExists kitti', courseExists)
            
            if (courseExists) {
                throw new Error(MESSAGES.WISHLIST.ALREADY_IN_WISHLIST)
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
