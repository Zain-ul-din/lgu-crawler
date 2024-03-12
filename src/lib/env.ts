import dotenv from "dotenv";

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV,
  OPEN_DB_KEY: process.env.OPEN_DB_KEY,
  OPEN_DB_IV: process.env.OPEN_DB_IV,
  PHPSESSID: process.env.PHPSESSID,
};

export default env;
