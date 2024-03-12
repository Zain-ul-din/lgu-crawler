import {existsSync, mkdirSync, writeFileSync} from "fs";
import env from "./env";
import {encrypt, hashStr, CIPHER_ALGO, ENCRYPTED_DATA_ENCODING} from "./cipher";

const DB_PATH = process.cwd() + "/db";
const LOCAL_DB_PATH = process.cwd() + "/local_db";

initLocalDB();

export function writeDB(uid: string, content: any, hash: boolean = true) {
  console.log(`🔃 Going to write '${uid}'`);
  writeDBLocal(uid, content);
  writeDBPublic(uid, content, hash);
  console.log(`✔ Operation succeed '${uid}'`);
}

function writeDBLocal(uid: string, content: any) {
  if (env.NODE_ENV !== "development") return;
  writeFileSync(`${LOCAL_DB_PATH}/${uid}.json`, JSON.stringify(content, null, 2), "utf-8");
}

function writeDBPublic(uid: string, content: any, hash: boolean = true) {
  const crypted = encrypt(JSON.stringify(content));
  writeFileSync(
    `${DB_PATH}/${hash ? hashStr(uid) : uid}.json`,
    JSON.stringify(
      {
        updated_at: new Date(),
        algo: CIPHER_ALGO,
        encoding: ENCRYPTED_DATA_ENCODING,
        crypted,
      },
      null,
      2
    ),
    "utf-8"
  );
}

function initLocalDB() {
  if (!existsSync(LOCAL_DB_PATH) && env.NODE_ENV === "development") mkdirSync(LOCAL_DB_PATH);
  if (!existsSync(DB_PATH)) mkdirSync(DB_PATH);
}
