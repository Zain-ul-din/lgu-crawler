import { existsSync, mkdirSync } from "fs";
import { DB_PATH, LOCAL_DB_PATH } from "./paths";
import { ENV } from "../constants";

export default function initLocalDB() {
  if (!existsSync(LOCAL_DB_PATH) && ENV.NODE_ENV === "development") mkdirSync(LOCAL_DB_PATH);
  if (!existsSync(DB_PATH)) mkdirSync(DB_PATH);
}
