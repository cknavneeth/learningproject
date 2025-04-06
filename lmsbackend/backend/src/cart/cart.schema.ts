import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document, Types } from 'mongoose';
import { Course } from '../instructors/courses/course.schema';
import { user } from '../users/users.schema';


export type CartDocument = Cart & Document;

@Schema({timestamps:true})
export class CartItem{
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:Course.name,required:true})
    courseId:mongoose.Schema.Types.ObjectId

    @Prop({default:Date.now})
    addedAt:Date
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true })
  user: user;

  @Prop([CartItem])
  items: CartItem[];

  @Prop({ default: 0 })
  totalAmount: number;
}

export const CartSchema=SchemaFactory.createForClass(Cart)

CartSchema.pre('save',async function(next){
    const cart=this as CartDocument
    await cart.populate('items.courseId','price')
    cart.totalAmount=cart.items.reduce((total,item:any)=>{
        return total+(item.courseId.price||0)
    },0)
    next()

})