// ********************************************************
// Responsible for loading env variable from .env file
// ********************************************************

import dotenv from "dotenv";

dotenv.config();

/**
 * Environment variables
 */
const ENV = {
  /**
   * The environment in which the application is running (e.g., "development", "production").
   */
  NODE_ENV: process.env.NODE_ENV,
  /**
   * The encryption key used for data encryption.
   */
  OPEN_DB_KEY: process.env.OPEN_DB_KEY,
  /**
   * The initialization vector used for encryption in an open database.
   */
  OPEN_DB_IV: process.env.OPEN_DB_IV,
  /**
   * The PHP session ID used as a cookie to bypass login.
   */
  PHPSESSID: process.env.PHPSESSID,
};

export default ENV;
