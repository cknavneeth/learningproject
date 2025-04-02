import { Module } from '@nestjs/common';
import { InstructorauthService } from './instructorauth.service';
import { InstructorsModule } from 'src/instructors/instructors.module';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { InstructorauthController } from './instructorauth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[InstructorsModule,CloudinaryModule,ConfigModule.forRoot(),
      JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET_KEY'),
              signOptions: { expiresIn: '15m' },
            }),
          }),
  ],
  providers: [InstructorauthService],
  exports:[InstructorauthService],
  controllers:[InstructorauthController]

})
export class InstructorauthModule {

}
