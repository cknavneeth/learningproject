import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('auth/admin')
export class AdminController {

    constructor(private readonly authservice:AdminService){}

    @Post('login')
    async adminlogin(@Body() body:{email:string,password:string}){
        return this.authservice.adminLogin(body.email,body.password)
    }
}
