import { writeFileSync } from "fs";
import { DB_PATH, LOCAL_DB_PATH } from "./paths";
import { ENV } from "../constants";
import { CIPHER_ALGO, ENCRYPTED_DATA_ENCODING, encrypt, hashStr } from "./cipher";
import FileSchema from "./types/FileSchema";
import { isSame } from "./util";

export function writeDB<T=any>(uid: string, content: T, hash: boolean = true) {
  console.log(`🔃 Going to write '${uid}'`);
  writeDBLocal(uid, content);
  console.log(`✔ Operation succeed '${uid}'`);
  return writeDBPublic<T>(uid, content, hash);
}

function writeDBLocal(uid: string, content: any) {
  if (ENV.NODE_ENV !== "development") return;
  writeFileSync(`${LOCAL_DB_PATH}/${uid}.json`, JSON.stringify(content, null, 2), "utf-8");
}

function writeDBPublic<T>(uid: string, content: T, hash: boolean = true): DBUpdateStatus<T> {
  const crypted = encrypt(JSON.stringify(content));
  
  const fileUID = hash ? hashStr(uid) : uid
  const fileData:FileSchema = {
    updated_at: new Date(),
    algo: CIPHER_ALGO,
    encoding: ENCRYPTED_DATA_ENCODING,
    crypted,
  }
  
  const similarity = isSame(fileUID, content) ? 'identical' : 'different'
  writeFileSync(`${DB_PATH}/${fileUID}.json`,JSON.stringify(fileData,null,2),"utf-8");

  return {
    similarity,
    content
  }
}
