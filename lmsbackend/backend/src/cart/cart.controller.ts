import { Controller, Get, UseGuards ,Request, Body, Post, Delete, NotFoundException, BadRequestException, HttpException, InternalServerErrorException, Version} from '@nestjs/common';
import { CartService } from './cart.service';
import { GuardGuard } from 'src/authentication/guard/guard.guard';
import { MESSAGE } from 'src/common/constants/messages.constants';
import { Roles } from 'src/decorators/roles.decarotor';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/guards/roles/roles.guard';


@Controller('auth/student/cart')
export class CartController {

    constructor(private readonly _cartService:CartService){}

    
    @Get()
    @Roles(Role.STUDENT)
    @Version('1')
    @UseGuards(GuardGuard,RolesGuard)
    async getCart(@Request() req){
        try {
            const userId=req.user.userId
            const cart=await this._cartService.getCart(userId)
            return cart
        } catch (error) {
            
        }
    }


    @Post('add')
    @Version('1')
    @UseGuards(GuardGuard)
    async addToCart(@Request() req,@Body() body:{courseId:string}){
        console.log('Received add to cart request:', {
            path: req.path,
            method: req.method,
            body: body,
            userId: req.user?.userId
        });
        try {
            const userId=req.user.userId
            const cart=await this._cartService.addToCart(userId,body.courseId)
            return cart
        } catch (error) {
            console.log('failed to add in cart')
            console.log('i also wnna see the error',error)
            if (error.message === 'Item already in cart'){
                throw new BadRequestException('Course already in cart');
            }
            if(error.message==='You are blocked from performing this action'){
                throw new BadRequestException('You are blocked from performing this action')
            }
            if(error.message==='Max limit reached'){
                throw new BadRequestException('Max limit reached for your cart')
            }
            if(error.message='This course is already purchased'){
                throw new BadRequestException('Already purchased!Dont need again right?')
            }
            
            
        }
    }

    @Delete('remove')
    @Version('1')
    @UseGuards(GuardGuard)
    async removeFromCart(@Request() req,@Body() body:{courseId:string}){
        try {
            const userId=req.user.userId
            const cart=await this._cartService.removeFromCart(userId,body.courseId)
            return cart
        } catch (error) {
            console.log('failed to remove from cart')
        }
    }



    @Delete('clear')
    @Version('1')
    @UseGuards(GuardGuard)
    async clearCart(@Request() req){
        try {
            const userId=req.user.userId
            const cart=await this._cartService.clearCart(userId)
            if(!cart){
                throw new NotFoundException('Cart not found')
            }
            return cart
        } catch (error) {
            console.log('failed to clear cart')
        }
    }


   



}
