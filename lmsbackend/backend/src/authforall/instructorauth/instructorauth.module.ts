import { Module } from '@nestjs/common';
import { InstructorauthService } from './instructorauth.service';
import { InstructorsModule } from 'src/instructors/instructors.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { InstructorauthController } from './instructorauth.controller';

@Module({
  imports:[InstructorsModule,CloudinaryModule],
  providers: [InstructorauthService],
  exports:[InstructorauthService],
  controllers:[InstructorauthController]

})
export class InstructorauthModule {

}
