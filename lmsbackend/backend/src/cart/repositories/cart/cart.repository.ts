import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from 'src/cart/cart.schema';
import { ICartRepository } from '../cart.repository.interface';
import { MESSAGES } from 'src/common/constants/messages.constants';

@Injectable()
export class CartRepository implements ICartRepository{
    constructor(
        @InjectModel(Cart.name) public cartModel: Model<CartDocument>
    ){ }

    async findByUser(userId:string):Promise<CartDocument|null>{
        return this.cartModel.findOne({user:userId})
        .populate({
            path:'items.courseId',
            select:'title price thumbnailUrl instructor',
            populate:{
                path:'instructor',
                select:'name'
            }
        })
        .exec()
    }


    async create(userId:string):Promise<CartDocument>{
        console.log('Starting cart creation for user:', userId);
        
        // Convert userId to ObjectId
        const userObjectId = new Types.ObjectId(userId);
        
        const cart = new this.cartModel({
            user: userObjectId,
            items: []
        });
        
        console.log('Cart model created, attempting to save');

        try {
            const savedCart = await cart.save();
            console.log('Cart saved successfully:', savedCart._id);
            return savedCart;
        } catch (saveError) {
            console.error('Error saving cart:', saveError);
            throw saveError;
        }
    }


    async addItem(userId:string,courseId:string):Promise<CartDocument|null>{
        console.log('CartRepository.addItem - Starting with:', { userId, courseId });
        const cart=await this.cartModel.findOne({user:userId})
        if(!cart){
            console.log('No cart found, throwing error');
            throw new NotFoundException(MESSAGES.CART.NOT_FOUND)
        }

        console.log('repositoriyulum vannu')

        cart.items.push({courseId:new Types.ObjectId(courseId) as any,addedAt:new Date()})
        console.log('cartil push aay')
        await cart.save()

        return this.cartModel.findById(cart._id)
            .populate({
                path:'items.courseId',
                select:'title price thumbnailUrl instructor',
                populate:{
                    path:'instructor',
                    select:'name'
                }
            }) 
            .exec() 
        }



        async removeItem(userId:string,courseId:string):Promise<CartDocument|null>{
            const cart=await this.cartModel.findOne({user:userId})
            if(!cart){
                throw new NotFoundException(MESSAGES.CART.NOT_FOUND)
            }

            cart.items=cart.items.filter(item=>item.courseId.toString()!==courseId)
            await cart.save()

            const updatedCart=await this.cartModel.findById(cart._id)
            .populate({
                path:'items.courseId',
                select:'title price thumbnailUrl instructor',
                populate:{
                    path:'instructor',
                    select:'name'
                }
            })
            .exec()

            return updatedCart
        }


        async clearCart(userId:string):Promise<CartDocument>{
            const cart=await this.cartModel.findOne({user:userId})
            if(!cart){
                throw new NotFoundException(MESSAGES.CART.NOT_FOUND)
            }
            cart.items=[]
            await cart.save()

            const clearedCart=await this.cartModel.findById(cart._id)
            .populate({
                path:'items.courseId',
                select:'title price thumbnailUrl instructor',
                populate:{
                    path:'instructor',
                    select:'name'
                }
            })
            .exec()

            if(!clearedCart){
                throw new NotFoundException('cart not found after clearing')
            }

            return clearedCart
        }
    
}
