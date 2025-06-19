import { BadRequestException, Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { auth } from 'google-auth-library';

@Injectable()
export class VerifymiddlewareMiddleware implements NestMiddleware {

  private logger=new Logger()

  constructor(private jwtService:JwtService){}
  use(req: any, res: any, next: () => void) {

    try {

       this.logger.log('entered into verify middleware')
      
       const authHeader=req.headers.authorization

       this.logger.log('authHeader',authHeader)

       if(!authHeader|| !authHeader.startsWith('Bearer ')){
          throw new BadRequestException('Token Not Found')
       }

       const token=authHeader.split(' ')[1]

       const jwtKey=this.jwtService.verify(token)

        if(jwtKey){
          next()
        }
    } catch (error) {
       throw new UnauthorizedException('Not Authorized')
    }
    
  }


}
