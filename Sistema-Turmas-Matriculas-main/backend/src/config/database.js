import 'dotenv/config';

export const databaseConfig = {
  dialect: 'sqlite',
  storage: './database.sqlite',
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
