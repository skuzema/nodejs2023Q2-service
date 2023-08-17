import * as dotenv from 'dotenv';
dotenv.config();

export const IS_PUBLIC_KEY = 'isPublic';

export const CRYPT_SALT = +process.env.CRYPT_SALT || 10;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY;
export const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME || '1h';
export const TOKEN_REFRESH_EXPIRE_TIME =
  process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h';

export const LOG_DIR = process.env.LOG_DIR || '../../logs';
export const LOG_MAX_SIZE = +process.env.LOG_MAX_SIZE || 100;
export const LOG_LEVEL = process.env.LOG_LEVEL || 2;
