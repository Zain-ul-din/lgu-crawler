import {existsSync, readFileSync} from "fs";
import {DB_PATH} from "./paths";
import {decrypt} from "./cipher";
import FileSchema from "./types/FileSchema";

export function readDB(uid: string, decrypted: boolean = true) {
  const filePath = `${DB_PATH}/${uid}.json`;
  if (!existsSync(filePath)) return "";
  const {crypted} = JSON.parse(readFileSync(filePath, "utf-8")) as FileSchema;
  return decrypted ? decrypt(crypted) : crypted;
}
