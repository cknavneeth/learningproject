import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class GuardGuard implements CanActivate {

  constructor(private jwtService:JwtService,private readonly configservice:ConfigService){}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request =context.switchToHttp().getRequest()
    const token= this.extractTokenFromHeader(request)

    if(!token){
      throw new UnauthorizedException('No token provided')
    }

    try {
      const payload=this.jwtService.verify(token,{  secret: this.configservice.get<string>('JWT_SECRET_KEY')})
      request.user=payload
      return true
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }

  private extractTokenFromHeader(request:any):string | undefined{
     const [type,token]=request.headers.authorization?.split(' ')??[]
     return type==='Bearer' ? token : undefined
  }
}
