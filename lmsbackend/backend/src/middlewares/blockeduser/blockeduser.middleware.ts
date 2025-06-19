import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { strict } from 'assert';
import { NextFunction, Request, Response } from 'express';
import { InstructorsService } from 'src/instructors/instructors.service';
import { HttpStatusCode } from 'src/shared/status-code.enum';
import { UserRepository } from 'src/users/repositories/user/user.repository';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BlockeduserMiddleware implements NestMiddleware {
    constructor(
      private readonly jwtService: JwtService,
      private readonly userService: UsersService,
      private readonly userRepository:UserRepository,
      private readonly instructorService: InstructorsService,
    ){}

    async use(req:Request,res:Response,next:NextFunction){
        try {
          const authHeader=req.headers.authorization
          console.log('check for authheader',authHeader)
          if(!authHeader){
            return next()
          }

          const token=authHeader.split(' ')[1]

          const decoded=this.jwtService.verify(token)

          console.log('decoded',decoded)

          if(req.url.includes('/student')){
            const user=await this.userRepository.findById(decoded.userId)
            if(user?.isBlocked){
              console.log('student block check')
              res.clearCookie('refreshToken',{httpOnly:true,secure:true,sameSite:'strict'})
              return res.status(HttpStatusCode.FORBIDDEN).json({
                message:'Your account has been blocked',
                isBlocked:true,
                statusCode:403
              })
            }
            
          }else if(req.url.includes('/instructor')){
            const instructor=await this.instructorService.findByEmail(decoded.emailaddress)
            if(instructor?.isBlocked){
               res.clearCookie('instructor_refreshToken',{httpOnly:true,secure:true,sameSite:'strict'})
              return res.status(HttpStatusCode.FORBIDDEN).json({
                message:'Your account has been blocked',
                isBlocked:true,
                statusCode:403
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

