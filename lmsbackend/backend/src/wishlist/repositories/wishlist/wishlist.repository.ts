import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CourseDocument } from 'src/instructors/courses/course.schema';
import { Wishlist,WishlistDocument  } from 'src/wishlist/wishlist.schema';


@Injectable()
export class WishlistRepository {
    constructor( @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>){}


    async findByUser(userId:string):Promise<WishlistDocument|null>{
        console.log('wishlist repository')
        const wishlist=await this.wishlistModel.findOne({user:userId})
        .populate({
            path: 'courses',
            select: 'title price thumbnailUrl instructor',
            populate: {
                path: 'instructor',
                select: 'name'
            }
        })
        .exec()

        console.log('found wishlist',wishlist)
        return wishlist
    }

    async create(userId:string):Promise<WishlistDocument>{
        const wishlist=new this.wishlistModel({
            user:new Types.ObjectId(userId),
            courses:[]
        })
        return wishlist.save()
    }


    async addToWishlist(userId:string,courseId:string):Promise<WishlistDocument|null>{
        console.log('wishlist repository')
        const wishlist=await this.wishlistModel.findOne({user:userId})
        if(!wishlist){
            throw new NotFoundException('Wishlist not found')
        }
        console.log('wishlist kitti',wishlist)
        if(!wishlist.courses.includes(courseId as any)){
            wishlist.courses.push(courseId as any)
            await wishlist.save()
        }
        console.log('wishlist pinnem kitti',wishlist)
        return this.findByUser(userId)
    }


    async removeFromWishlist(userId:string,courseId:string):Promise<WishlistDocument|null>{
        const wishlist=await this.wishlistModel.findOne({user:userId})
        if(!wishlist){
            throw new NotFoundException('Wishlist not found')
        }

        wishlist.courses=wishlist.courses.filter(course=>course.toString()!==courseId)
    
        await wishlist.save()
        return this.findByUser(userId)
    }

    
}
