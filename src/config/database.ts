import 'reflect-metadata';
import { DataSource } from 'typeorm';
import type { Config } from './environment';
import { User } from '../entities/User';
import { CreateUsers1791072000000 } from '../migrations/1791072000000-CreateUsers';

/** Schema changes only through explicit migrations; database creation is external. */
export function createDataSource(config: Config): DataSource {
  return new DataSource({
    type: 'mysql',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    entities: [User],
    migrations: [CreateUsers1791072000000],
    synchronize: false,
    logging: false,
    migrationsTransactionMode: 'none',
    timezone: 'Z',
    charset: 'utf8mb4',
    connectTimeout: 5000,
    extra: { connectionLimit: 5 },
  });
}
