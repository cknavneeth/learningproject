import { Body, Controller, Get, Inject, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { GuardGuard } from 'src/authentication/guard/guard.guard';
import { ICertificateService } from '../service/interfaces/certificate.service.interface';
import { CERTIFICATE_SERVICE } from '../constants/constant';

@Controller('certificate')
export class CertificateController {

    constructor(@Inject(CERTIFICATE_SERVICE) private readonly certificateService:ICertificateService){}

    @Get()
    @UseGuards(GuardGuard)
    async getUserCertificates(
        @Req() req:any,
        @Query('page')  page:number,
        @Query('limit') limit:number
    ){
        const userId=req.user.userId
        return this.certificateService.getUserCertificates(userId,page,limit)
    }


    @Post('generate')
    @UseGuards(GuardGuard)
    async generateCertificate(@Req() req:any,@Body() body:{
        courseId:string
    }){
        const userId=req.user.userId
        return this.certificateService.generateCertificate(userId,body.courseId,new Date())
    }


    @Get(':certificateId')
    @UseGuards(GuardGuard)
    async getCertificateById(@Req() req:any,@Param('certificateId') certificateId:string ){
        const userId=req.user.userId
        return this.certificateService.getCertificateById(certificateId)
    }
}
