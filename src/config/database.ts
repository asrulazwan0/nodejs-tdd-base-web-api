import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nodejs_tdd_api',
  synchronize: process.env.NODE_ENV !== 'production', // Only use in development
  logging: process.env.NODE_ENV !== 'production',
  entities: [`${__dirname}/../entities/*.{ts,js}`],
  migrations: [`${__dirname}/../migrations/*.{ts,js}`],
  subscribers: [`${__dirname}/../subscribers/*.{ts,js}`],
});