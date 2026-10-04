import { QueryFailedError } from 'typeorm';
import { User } from '../../src/entities/User';
import { UserRepository } from '../../src/repositories/UserRepository';
import { createDataSource } from '../../src/config/database';
import { testConfig } from '../helpers/config';
const input = { email: 'test@example.test', firstName: 'Test', lastName: 'Profile' };
test('unexpected database errors remain unexpected rather than becoming email conflicts', async () => {
  const db = createDataSource(testConfig());
  const backing = db.getRepository(User);
  jest.spyOn(backing, 'create').mockReturnValue(Object.assign(new User(), input));
  jest
    .spyOn(backing, 'save')
    .mockRejectedValue(new QueryFailedError('synthetic query', [], new Error('synthetic outage')));
  await expect(new UserRepository(db).create(input)).rejects.toThrow('synthetic outage');
});
test('unknown affected count does not claim a successful deletion', async () => {
  const db = createDataSource(testConfig());
  jest.spyOn(db.getRepository(User), 'delete').mockResolvedValue({ raw: [] });
  expect(await new UserRepository(db).delete('synthetic-id')).toBe(false);
});
