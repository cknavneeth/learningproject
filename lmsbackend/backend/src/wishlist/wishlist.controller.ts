import { Controller, Get, UseGuards,Request, BadRequestException, Post, Body, Delete } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { GuardGuard } from 'src/authentication/guard/guard.guard';

@Controller('auth/student/wishlist')
export class WishlistController {
    constructor(private readonly wishlistService:WishlistService){}

    @Get()
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
    @UseGuards(GuardGuard)
    async addToWishlist(@Request() req,@Body() body:{courseId:string}){
        console.log('wishlist controller')
        try {
            const userId=req.user.userId
            return await this.wishlistService.addToWishlist(userId,body.courseId)

        } catch (error) {
            if (error.message === 'Course already in wishlist') {
                throw new BadRequestException('Course already in wishlist');
            }
            throw new BadRequestException('Failed to add to wishlist');
        }
    }


    @Delete('remove')
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
