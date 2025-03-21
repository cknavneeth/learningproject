import { BlockeduserMiddleware } from './blockeduser.middleware';

describe('BlockeduserMiddleware', () => {
  it('should be defined', () => {
    expect(new BlockeduserMiddleware()).toBeDefined();
  });
});
