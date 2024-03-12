import {existsSync, mkdirSync, writeFileSync} from "fs";
import env from "./env";
import {encrypt} from "./cipher";

const DB_PATH = process.cwd() + "/db";
const LOCAL_DB_PATH = process.cwd() + "/local_db";

if (env.NODE_ENV === "development") initLocalDB();

export function writeDB(uid: string, content: any) {
  console.log(`🔃 Going to write ${uid}.json`);
  writeDBLocal(uid, content);
  writeDBPublic(uid, content);
  console.log(`✔ Operation succeed ${uid}.json`);
}

function writeDBLocal(uid: string, content: any) {
  if (env.NODE_ENV !== "development") return;
  writeFileSync(`${LOCAL_DB_PATH}/${uid}.json`, JSON.stringify(content, null, 2), "utf-8");
}

function writeDBPublic(uid: string, content: any) {
  writeFileSync(`${DB_PATH}/${uid}.txt`, encrypt(JSON.stringify(content)), "utf-8");
}

function initLocalDB() {
  if (!existsSync(LOCAL_DB_PATH)) mkdirSync(LOCAL_DB_PATH);
}
