import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('auth/admin')
export class AdminController {
    constructor(private readonly adminservice:AdminService){}

    @Get('students')
    async fetchallstudents(){
        return this.adminservice.fetchallstudents()
    }

    @Patch('toggleblock/:studentId')
    async toggleBlockStatus(@Param('studentId') studentId:string){
        console.log('jijo shibu',studentId)
        return this.adminservice.toggleBlockStatus(studentId)
    }

    @Get('/instructors')
    async fetchallinstructors(){
        return this.adminservice.fetchallinstructors()
    }

    @Patch('blockinstructor/:instructorId')
    async toggleblockInstructor(@Param('instructorId') instructorId:string){
        return this.adminservice.blockstatus(instructorId)
    }


    @Patch('verifyinstructor/:instructorId')
    async verifyinstructor(@Param('instructorId') instructorId:string,@Body() body:{isApproved:boolean}){
          return this.adminservice.verifyinstructor(instructorId,body.isApproved)
    }
}
