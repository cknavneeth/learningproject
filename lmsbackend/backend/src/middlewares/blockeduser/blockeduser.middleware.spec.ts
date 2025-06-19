import { JwtService } from '@nestjs/jwt';
import { BlockeduserMiddleware } from './blockeduser.middleware';
import { UsersService } from 'src/users/users.service';
import { UserRepository } from 'src/users/repositories/user/user.repository';
import { InstructorsService } from 'src/instructors/instructors.service';

describe('BlockeduserMiddleware', () => {
  it('should be defined', () => {
    const mockJwtService = new JwtService({} as any); // minimal config or `as any`
    const mockUsersService = {} as UsersService;
    const mockUserRepository = {} as UserRepository;
    const mockInstructorsService = {} as InstructorsService;

    const middleware = new BlockeduserMiddleware(
      mockJwtService,
      mockUsersService,
      mockUserRepository,
      mockInstructorsService,
    );

    expect(middleware).toBeDefined();
  });
});


