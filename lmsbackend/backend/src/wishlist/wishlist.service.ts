import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WishlistRepository } from './repositories/wishlist/wishlist.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'src/instructors/courses/course.schema';
import { Model } from 'mongoose';
import { MESSAGE } from 'src/common/constants/messages.constants';
import { UserRepository } from 'src/users/repositories/user/user.repository';
import { MYWISHLIST_REPOSITORY } from './constants/constant';
import { IWishlistRepository } from './repositories/wishlist.repository.interface';
import { plainToInstance } from 'class-transformer';
import { wishlistResponseDto } from './dto/response-wishlist.dto';

@Injectable()
export class WishlistService {
    constructor(
        // private readonly wishlistRepository:WishlistRepository,
        @Inject(MYWISHLIST_REPOSITORY) private _wishlistRepository:IWishlistRepository,
        @InjectModel(Course.name) private courseModel:Model<Course> ,
        private readonly userRepository:UserRepository
    ){}


    async getWishlist(userId:string){
        try {
            let wishlist=await this._wishlistRepository.findByUser(userId)
            if(!wishlist){
            wishlist=await this._wishlistRepository.create(userId)
            }

            const mappedWishlist=plainToInstance(
                wishlistResponseDto,
                wishlist.toObject()
            )
            return mappedWishlist
        } catch (error) {
            throw Error(MESSAGE.COMMON.SERVER_ERROR)
        }
       
        // return wishlist

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
            const wishlist = await this._wishlistRepository.findByUser(userId)
    
            if (!wishlist) {
                console.log('Creating new wishlist for user:', userId);
                const newWishlist = await this._wishlistRepository.create(userId);
                return this._wishlistRepository.addToWishlist(userId, courseId);
            }
    
            console.log('wishlist kitti')
            const courseExists = wishlist.courses.some(course => course._id.toString() === courseId)
            
            if (courseExists) {
                throw new Error(MESSAGE.WISHLIST.ALREADY_IN_WISHLIST)
            }
            
            return this._wishlistRepository.addToWishlist(userId, courseId)
        } 
        catch (error) {
            console.error('Error in addToWishlist:', error);
            throw error;
        }
    }



    async removeFromWishlist(userId:string,courseId:string){
        return this._wishlistRepository.removeFromWishlist(userId,courseId)
    }

}
