import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost' || '127.0.0.1',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin@123',
  database: process.env.DB_DATABASE || 'moneyTracker',
  synchronize: true,
  entities: ['dist/**/entities/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
};

export const datasource = new DataSource({ ...options });
