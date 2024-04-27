import {existsSync, mkdirSync} from "fs";
import {DB_PATH, LOCAL_DB_PATH} from "./paths";
import {ENV} from "#/constants";

/**
 * Initializes the local database directory.
 * If the local database directory does not exist and the environment is development, it creates the directory.
 * It also creates the main database directory if it does not exist.
 */
export function initLocalDB() {
  if (!existsSync(LOCAL_DB_PATH) && ENV.NODE_ENV === "development") mkdirSync(LOCAL_DB_PATH);
  if (!existsSync(DB_PATH)) mkdirSync(DB_PATH);
}

