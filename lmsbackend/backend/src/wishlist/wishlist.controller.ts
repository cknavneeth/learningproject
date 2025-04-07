import { Controller, Get, UseGuards,Request, BadRequestException } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { GuardGuard } from 'src/authentication/guard/guard.guard';

@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService:WishlistService){}

    // @Get()
    // @UseGuards(GuardGuard)
    // async getWishlist(@Request() req){
    //     try {
    //         const userId=req.user.userId
    //         const wishlist=await this.wishlistService.getWishlist(userId)
    //         return wishlist
    //     } catch (error) {
    //         throw new BadRequestException('Failed to fetch wishlist')
    //     }
    // }
}
