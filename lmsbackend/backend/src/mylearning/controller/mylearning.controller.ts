
import { GuardGuard } from 'src/authentication/guard/guard.guard';
import { MYLEARNING_SERVICE } from '../constants/mylearning.constants';
import { IMyLearningService } from '../service/interfaces/mylearning.service.interface';
import { Body, Controller, DefaultValuePipe, Get, Inject, Param, ParseIntPipe, Post, Query, Req, UnauthorizedException, UseGuards, Res, Put, Logger, } from '@nestjs/common';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { Roles } from 'src/decorators/roles.decarotor';
import { Role } from 'src/common/enums/role.enum';

@Controller('auth/student/learning')
export class MylearningController {
    private logger=new Logger(MylearningController.name)

    constructor(@Inject(MYLEARNING_SERVICE) private readonly _mylearningService:IMyLearningService){}


    @Get()
    @UseGuards(GuardGuard)
    @Roles(Role.STUDENT)
    async getEnrolledCourses(
        @Req() req,
        @Query('page',new DefaultValuePipe(1),ParseIntPipe) page:number,
        @Query('limit',new DefaultValuePipe(10),ParseIntPipe) limit:number
    ){
        console.log('enroll ayath kittm chelpo')
        const userId=req.user.userId
        this.logger.log('checking emaillllll',req.user.email,req.user.username)
        return this._mylearningService.getEnrolledCourses(userId,page,limit)
    }

    @Get('course/:courseId')
    @UseGuards(GuardGuard)
    async getCourseDetails(
        @Req() req,
        @Param('courseId') courseId: string
    ) {
        const userId=req.user.userId
        console.log('Course details request:', {
            userId: userId,
            courseId: courseId,
            user: req.user
        });
        
        if (!userId) {
            console.log('authenticated alla ketoo haha')
            throw new UnauthorizedException('User not authenticated');
        }
        if (!userId) {
            console.log('No userId found in request');
            throw new UnauthorizedException('User not authenticated');
        }

        return this._mylearningService.getCourseDetails(userId, courseId);
    }



    @Put('course/:courseId/progress')
    @UseGuards(GuardGuard)
    async updateProgress(
        @Req() req,
        @Param('courseId') courseId:string,
        @Body() updateProgressDto:UpdateProgressDto
    ){
        console.log('Update progress request received:', {
            userId: req.user.userId,
            courseId: courseId,
            updateData: updateProgressDto
        });

        if(!updateProgressDto.sectionId){
            throw new HttpException('Section ID is required',HttpStatus.BAD_REQUEST)
        }

        console.log('sectionid is here ',updateProgressDto.sectionId)
        console.log('type veno',typeof updateProgressDto.sectionId)

        const userId=req.user.userId
         const result=await this._mylearningService.updateProgress(userId,courseId,updateProgressDto.sectionId,updateProgressDto.progress)
         console.log('result ahneyyy',result)
         return result
    }


    @Get('course/:courseId/resources/:resourceId/download')
    @UseGuards(GuardGuard)
    async downloadResource(
        @Param('courseId') courseId: string,
        @Param('resourceId') resourceId: string,
        @Req() req,
        @Res() res
    ) {
        const userId = req.user.userId;
        const resourceInfo = await this._mylearningService.downloadResource(userId, courseId, resourceId);
        
        // Fetch the file from Cloudinary
        const response = await fetch(resourceInfo.fileUrl);
        const buffer = await response.arrayBuffer();
        
        // Set appropriate headers
        res.set({
            'Content-Type': resourceInfo.contentType,
            'Content-Disposition': `attachment; filename="${resourceInfo.fileName}"`,
            'Content-Length': buffer.byteLength,
        });
        
        // Send the file
        res.send(Buffer.from(buffer));
    }

    



    @Get('course/:courseId/progress')
@UseGuards(GuardGuard)
async getCourseProgress(
    @Req() req,
    @Param('courseId') courseId: string
) {
    const userId = req.user.userId;
    return this._mylearningService.getCourseProgress(userId, courseId);
}
}
