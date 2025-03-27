import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { user, userSchema } from './users.schema';
import { UserRepository } from './repositories/user/user.repository';
import { AuthenticationModule } from 'src/authentication/auth.module';



@Module({
  imports:[MongooseModule.forFeature([{name:user.name,schema:userSchema}]),AuthenticationModule],
  providers: [UsersService,
   UserRepository
  ],
  controllers: [UsersController],
  exports:[UsersService]
})
export class UsersModule {}
