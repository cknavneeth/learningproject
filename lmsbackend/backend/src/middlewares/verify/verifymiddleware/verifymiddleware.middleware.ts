import { InjectRedis } from '@nestjs-modules/ioredis';
import { BadRequestException, Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { auth } from 'google-auth-library';
import Redis from 'ioredis';

@Injectable()
export class VerifymiddlewareMiddleware implements NestMiddleware {

  private logger=new Logger()

  constructor(private jwtService:JwtService,
    @InjectRedis() private redis:Redis
  ){}
  async use(req: any, res: any, next: () => void) {

    try {

       this.logger.log('entered into verify middleware')
      
       const authHeader=req.headers.authorization

       this.logger.log('authHeader',authHeader)

       if(!authHeader|| !authHeader.startsWith('Bearer ')){
          throw new BadRequestException('Token Not Found')
       }

       const token=authHeader.split(' ')[1]

       //gonna check is this token is blacklisted or not
       const isBlackListed=await this.redis.get(`blacklist:${token}`)
       if(isBlackListed){
         this.logger.log('blacklisted bro no way')
          throw new UnauthorizedException('Token has been blacklisted')
       }

       const jwtKey=this.jwtService.verify(token)

        if(jwtKey){
          next()
        }
    } catch (error) {
       throw new UnauthorizedException('Not Authorized')
    }
    
  }


}
