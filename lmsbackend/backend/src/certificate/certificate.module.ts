import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Certificate, CertificateSchema } from './schema/certificate.schema';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { CERTIFICATE_REPOSITORY, CERTIFICATE_SERVICE } from './constants/constant';
import { CertificateService } from './service/certificate.service';
import { CoursesModule } from 'src/instructors/courses/courses.module';
import { UsersModule } from 'src/users/users.module';
import { CertificateRepository } from './repository/certificate.repository';
import { InstructorsModule } from 'src/instructors/instructors.module';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Certificate.name,schema:CertificateSchema}]),
        CloudinaryModule,
        CoursesModule,
        UsersModule,
        InstructorsModule

    ],
    providers:[
        {
             provide:CERTIFICATE_SERVICE,
             useClass:CertificateService
        },
        {
            provide:CERTIFICATE_REPOSITORY,
            useClass:CertificateRepository

        }
    ],
    exports:[CERTIFICATE_SERVICE,CERTIFICATE_REPOSITORY]
})
export class CertificateModule {}
