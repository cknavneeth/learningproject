import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { InstructorsService } from 'src/instructors/instructors.service';
import { HttpStatusCode } from 'src/shared/status-code.enum';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BlockeduserMiddleware implements NestMiddleware {
    constructor(
      private readonly jwtService: JwtService,
      private readonly userService: UsersService,
      private readonly instructorService: InstructorsService,
    ){}

    async use(req:Request,res:Response,next:NextFunction){
        try {
          const authHeader=req.headers.authorization
          if(!authHeader){
            return next()
          }

          const token=authHeader.split(' ')[1]

          const decoded=this.jwtService.verify(token)

          console.log('decoded',decoded)

          if(req.url.includes('/student')){
            const user=await this.userService.findByEmail(decoded.email)
            if(user?.isBlocked){
              console.log('student block check')
              return res.status(HttpStatusCode.UNAUTHORIZED).json({
                message:'Your account has been blocked',
                isBlocked:true,
                statusCode:401
              })
            }
          }else if(req.url.includes('/instructor')){
            const instructor=await this.instructorService.findByEmail(decoded.emailaddress)
            if(instructor?.isBlocked){
              return res.status(HttpStatusCode.UNAUTHORIZED).json({
                message:'Your account has been blocked',
                isBlocked:true,
                statusCode:401
              })
            }
          }

          next()
        } catch (error) {
          console.log('middleware error',error)
          throw new UnauthorizedException({
            message: 'Your account has been blocked',
            isBlocked: true,
            statusCode: HttpStatusCode.UNAUTHORIZED
          })
        }
    }


  }

