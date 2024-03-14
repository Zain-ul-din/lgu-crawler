import { writeFileSync } from "fs";
import { DB_PATH, LOCAL_DB_PATH } from "./paths";
import { ENV } from "../constants";
import { CIPHER_ALGO, ENCRYPTED_DATA_ENCODING, decrypt, encrypt, hashStr } from "./cipher";

export function writeDB(uid: string, content: any, hash: boolean = true) {
  console.log(`🔃 Going to write '${uid}'`);
  writeDBLocal(uid, content);
  writeDBPublic(uid, content, hash);
  console.log(`✔ Operation succeed '${uid}'`);
}

function writeDBLocal(uid: string, content: any) {
  if (ENV.NODE_ENV !== "development") return;
  writeFileSync(`${LOCAL_DB_PATH}/${uid}.json`, JSON.stringify(content, null, 2), "utf-8");
}

function writeDBPublic(uid: string, content: any, hash: boolean = true) {
  const crypted = encrypt(JSON.stringify(content));

  const fileUID = hash ? hashStr(uid) : uid
  const fileData = {
    updated_at: new Date(),
    algo: CIPHER_ALGO,
    encoding: ENCRYPTED_DATA_ENCODING,
    crypted,
  }
  writeFileSync(`${DB_PATH}/${fileUID}.json`,JSON.stringify(fileData,null,2),"utf-8");
}
