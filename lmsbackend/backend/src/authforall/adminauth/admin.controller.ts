import { Body, Controller, Logger, Post, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Controller('auth/admin')
export class AdminController {

    private logger=new Logger()

    constructor(
        private readonly authservice:AdminService,
        private readonly jwtService:JwtService,
        @InjectRedis() private redis:Redis

    ){}

    @Post('login')
    async adminlogin(@Body() body:{email:string,password:string}){
        return this.authservice.adminLogin(body.email,body.password)
    }

    @Post('logout')
    async logoutadmin(@Req() req){
        
        try {
            const adminaccessToken=req.authorization.headers.split(' ')[1]
            this.logger.log(adminaccessToken)
            if(adminaccessToken){
                const decode=this.jwtService.decode(adminaccessToken)
                const exp=decode.exp
                const ttl=exp-Math.floor(Date.now()/1000)
                await this.redis.set(`blacklist:${adminaccessToken}`, 'true', 'EX', ttl)
            }

        } catch (error) {
            
        }
        return {
            success:true,
            message:'Logged out successfully'
        }
    }
}
