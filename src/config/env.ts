import 'dotenv/config';

export const CONFIG = {
  AWESOME_API_URL: process.env.AWESOME_API_URL || 'https://economia.awesomeapi.com.br/json/last',
  NODE_ENV: process.env.NODE_ENV || 'development'
};