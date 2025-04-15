import { BadRequestException, Injectable } from '@nestjs/common';
import { CartRepository } from './repositories/cart/cart.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'src/instructors/courses/course.schema';
import { Model, Types } from 'mongoose';
import { MESSAGES } from 'src/common/constants/messages.constants';

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
            throw new Error(MESSAGES.COURSE.NOT_FOUND)
        }
        let cart=await this.cartRepository.findByUser(userId)
        if(!cart){
            console.log('Creating new cart for user:', userId);
            cart=await this.cartRepository.create(userId)
        }
        if (cart.items.length > 0) {
            const firstItemId = cart.items[0].courseId;
            console.log('Debug Info:', {
                firstItemIdType: typeof firstItemId,
                firstItemIdValue: firstItemId,
                firstItemIdString: firstItemId.toString(),
                courseIdToAdd: courseId,
                courseIdToAddType: typeof courseId,
                isEqual: firstItemId.toString() === courseId
            });
        }

        const rawCart=await this.cartRepository.cartModel.findOne({user:userId})
        if(!rawCart){
            throw new Error(MESSAGES.CART.NOT_FOUND)
        }

        
        const courseExists = rawCart.items.some(item => {
            const itemId = item.courseId.toString();
            const isMatch = itemId === courseId;
            console.log('Comparing:', {
                itemId,
                courseId,
                isMatch
            });
            return isMatch;
        });
        if(courseExists){
            console.log('Course already in cart:', courseId);
            throw new BadRequestException(MESSAGES.CART.ALREADY_IN_CART)
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
        console.log('hh call ingot ethitinda')
        try {
            const cart=await this.cartRepository.clearCart(userId)
            if(!cart){
                throw new BadRequestException('Cart not found')
            }
            return cart
        } catch (error) {
            console.log('failed to clear cart')
        }
    }
}
