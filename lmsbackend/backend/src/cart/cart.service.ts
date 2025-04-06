import { BadRequestException, Injectable } from '@nestjs/common';
import { CartRepository } from './repositories/cart/cart.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'src/instructors/courses/course.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartService {

    constructor(private readonly cartRepository:CartRepository,
        @InjectModel(Course.name) private courseModel: Model<Course>
    ){}

    async getCart(userId:string){
        let cart=await this.cartRepository.findByUser(userId)
        if(!cart){
            cart=await this.cartRepository.create(userId)
        }
        return cart
    }


    async addToCart(userId:string,courseId:string){
        console.log('CartService.addToCart - Start', { userId, courseId });
        const course=await this.courseModel.findById(courseId)
        if(!course){
            console.log('Course not found:', courseId)
            throw new Error('Course not found')
        }
        let cart=await this.cartRepository.findByUser(userId)
        if(!cart){
            console.log('Creating new cart for user:', userId);
            cart=await this.cartRepository.create(userId)
        }
        const courseExists=cart.items.find(item=>item.courseId.toString()===courseId)
        if(courseExists){
            console.log('Course already in cart:', courseId);
            throw new BadRequestException('Course already in cart')
        }
        console.log('Adding item to cart via repository');
        const updatedCart=await this.cartRepository.addItem(userId,courseId)
        console.log('Item added to cart successfully');
        return updatedCart
    }



    async removeFromCart(userId:string,courseId:string){
        try {
            const cart=await this.cartRepository.removeItem(userId,courseId)
            return cart
        } catch (error) {
            console.log('error removing from cart',error)
        }
    }


    async clearCart(userId:string){
        try {
            const cart=await this.cartRepository.clearCart(userId)
            return cart
        } catch (error) {
            console.log('failed to clear cart')
        }
    }
}
