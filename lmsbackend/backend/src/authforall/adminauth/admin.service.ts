import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AdminService as MainAdminService } from '../../admin/admin.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {

    constructor(private readonly adminService:MainAdminService,private readonly jwtService:JwtService){}

    private logger=new Logger()

    async adminLogin(email:string,password:string){
        let admin=await this.adminService.findbyEmail(email)

        if(!admin){
            throw new BadRequestException('invalid email or password')
        }

        if(admin.password!==password){
            throw new BadRequestException('Password is not matching blud')
        }
        const token=this.generateadmintoken({ email: admin.email, role: 'admin' })

        return {accesstoken:token,message:'Login successfully'}
    }

    generateadmintoken(payload:object){
        const expiresIn=process.env.JWT_ADMIN_MAX_AGE

        this.logger.log('admin expiration',expiresIn)

        let newtoken=this.jwtService.sign(payload, { expiresIn })
        return newtoken
    }


}
