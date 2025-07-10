import { Controller, Get, UseGuards,Request, BadRequestException, Post, Body, Delete, Version } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { GuardGuard } from 'src/authentication/guard/guard.guard';

@Controller('auth/student/wishlist')
export class WishlistController {
    constructor(private readonly wishlistService:WishlistService){}

    @Get()
    @Version('1')
    @UseGuards(GuardGuard)
    async getWishlist(@Request() req){
        try {
            const userId=req.user.userId
            const wishlist=await this.wishlistService.getWishlist(userId)
            return wishlist
        } catch (error) {
            throw new BadRequestException('Failed to fetch wishlist')
        }
    }


    @Post('add')
    @Version('1')
    @UseGuards(GuardGuard)
    async addToWishlist(@Request() req,@Body() body:{courseId:string}){
        console.log('wishlist controller')
        try {
            const userId=req.user.userId
            return await this.wishlistService.addToWishlist(userId,body.courseId)

        } catch (error) {
            if (error.message === 'Item already in wishlist') {
                throw new BadRequestException('Course already in wishlist');
            }
            if(error.message==='You are blocked'){
                throw new BadRequestException('You are blocked from using this platform')
            }
            if(error.message==='Max limit reached'){
                throw new BadRequestException('Max limit reached for Wishlist')
            }
        }
    }


    @Delete('remove')
    @Version('1')
    @UseGuards(GuardGuard)
    async removeFromWishlist(@Request () req,@Body() body:{courseId:string}){
        try {
            const userId=req.user.userId
            return await this.wishlistService.removeFromWishlist(userId,body.courseId)
        } catch (error) {
            throw new BadRequestException('Failed to remove from wishlist')
        }
    }
}
