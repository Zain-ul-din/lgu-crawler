import { existsSync, readFileSync } from "fs";
import { LOCAL_DB_PATH } from "./paths";
import { decrypt } from "./cipher";

export function readDB(uid: string) {
  const filePath = `${LOCAL_DB_PATH}/${uid}.json`;
  if(!existsSync(filePath)) return "";
  const { crypted } = JSON.parse(readFileSync(filePath, 'utf-8'));
  return decrypt(crypted)
}
