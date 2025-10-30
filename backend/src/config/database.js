import 'dotenv/config';

export const databaseConfig = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'stm',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  dialect: 'postgres',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'dev-secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h'
};

export const appConfig = {
  port: Number(process.env.PORT || 3333),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};
