import { BadRequestException, ForbiddenException, HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CartRepository } from './repositories/cart/cart.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'src/instructors/courses/course.schema';
import { Model, Types } from 'mongoose';
import { MESSAGE } from 'src/common/constants/messages.constants';
import { UserRepository } from 'src/users/repositories/user/user.repository';
import { plainToInstance } from 'class-transformer';
import { responsecartDto } from './dto/response-cart.dto';
import { ICartRepository } from './repositories/cart.repository.interface';

@Injectable()
export class CartService {

    constructor(
        // private readonly _cartRepository:CartRepository,
        @Inject(CartRepository) private _cartRepository:ICartRepository,
        @InjectModel(Course.name) private _courseModel: Model<Course>,
        private readonly _userRepository:UserRepository
    ){}

    async getCart(userId:string){
        try {
            let cart=await this._cartRepository.findByUser(userId)
            if(!cart){
                cart=await this._cartRepository.create(userId)
            }

            const mappedCart=plainToInstance(
                responsecartDto,
                cart.toObject()
            )
            
             return mappedCart
           
        } catch (error) {
             throw new NotFoundException('Cart not found')
        }
    }


    async addToCart(userId:string,courseId:string){


        
        const user=await this._userRepository.findById(userId)
        if(user){
            if(user.isBlocked){
                console.log('nee block aay')
                throw new ForbiddenException({
                    status:403,
                    message:'You are blocked from performing this action'
                })
            }
        }



        console.log('CartService.addToCart - Start', { userId, courseId });
        const course=await this._courseModel.findById(courseId)
        if(!course){
            console.log('Course not found:', courseId)
            throw new Error(MESSAGE.COURSE.NOT_FOUND)
        }
        let cart=await this._cartRepository.findByUser(userId)
        if(!cart){
            console.log('Creating new cart for user:', userId);
            cart=await this._cartRepository.create(userId)
        }

        if(cart.items.length>=3){
            throw new Error('Max limit reached')
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

        // const rawCart=await this._cartRepository.cartModel.findOne({user:userId})

        const rawCart=await this._cartRepository.findUserById(userId)
        if(!rawCart){
            throw new Error(MESSAGE.CART.NOT_FOUND)
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
            throw new BadRequestException(MESSAGE.CART.ALREADY_IN_CART)
        }
        console.log('Adding item to cart via repository');
        const updatedCart=await this._cartRepository.addItem(userId,courseId)
        console.log('Item added to cart successfully');
        return updatedCart
        
       
    }



    async removeFromCart(userId:string,courseId:string){
        try {
            const cart=await this._cartRepository.removeItem(userId,courseId)
            return cart
        } catch (error) {
            console.log('error removing from cart',error)
        }
    }


    async clearCart(userId:string){
        console.log('hh call ingot ethitinda')
        try {
            const cart=await this._cartRepository.clearCart(userId)
            if(!cart){
                throw new BadRequestException('Cart not found')
            }
            return cart
        } catch (error) {
            console.log('failed to clear cart')
        }
    }

    
}
