import * as dotenv from 'dotenv';

dotenv.config();

export const IS_PUBLIC_KEY = 'isPublic';

export const CRYPT_SALT = +process.env.CRYPT_SALT;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_SECRET_REFRESH_KEY = process.env.JWT_SECRET_REFRESH_KEY;
export const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME;
export const TOKEN_REFRESH_EXPIRE_TIME = process.env.TOKEN_REFRESH_EXPIRE_TIME;

export const LOG_DIR = process.env.LOG_DIR;
export const LOG_MAX_SIZE = +process.env.LOG_MAX_SIZE;
export const LOG_LEVEL = +process.env.LOG_LEVEL;
