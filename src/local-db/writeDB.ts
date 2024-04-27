import {writeFileSync} from "fs";
import {DB_PATH, LOCAL_DB_PATH} from "./paths";
import {ENV} from "#/constants";
import {CIPHER_ALGO, ENCRYPTED_DATA_ENCODING, encrypt, hashStr} from "./cipher";
import FileSchema from "./types/FileSchema";
import {isSame} from "./util";
import DBUpdateStatus from "./types/DBUpadateStatus";
import DBWriteOptions from "./types/DBWriteOptions";
import pc from "picocolors";

/**
 * Default options for writing to the database
 */
const DEFAULT_OPTIONS: DBWriteOptions<any> = {
  hash: true,
  compare(curr, previous) {
    return curr === previous;
  },
};

/**
 * Writes data to the database with the given UID.
 * @param uid The unique identifier of the data.
 * @param content The data to write to the database.
 * @param options The options for writing to the database.
 * @returns The status of the database update operation.
 */
export function writeDB<T = any>(uid: string, content: T, options: DBWriteOptions<T> = DEFAULT_OPTIONS) {
  const _options = {...DEFAULT_OPTIONS, ...options};
  writeDBLocal(uid, content);
  return writeDBPublic<T>(uid, content, _options);
}

/**
 * Writes data to the local database directory only in development.
 * @param uid The unique identifier of the data.
 * @param content The data to write to the local database.
 */
function writeDBLocal(uid: string, content: any) {
  if (ENV.NODE_ENV !== "development") return;
  writeFileSync(`${LOCAL_DB_PATH}/${uid}.json`, JSON.stringify(content, null, 2), "utf-8");
}

/**
 * Writes encrypted data to the public database directory.
 * @param uid The unique identifier of the data.
 * @param content The data to write to the public database.
 * @param hash Indicates whether to hash the UID.
 * @param compare A custom comparison function to determine if the content has changed.
 * @returns The status of the database update operation.
 */
function writeDBPublic<T>(uid: string, content: T, {hash, compare}: DBWriteOptions<T>): DBUpdateStatus<T> {
  const crypted = encrypt(JSON.stringify(content));

  const fileUID = hash ? hashStr(uid) : uid;
  const fileData: FileSchema = {
    updated_at: new Date(),
    algo: CIPHER_ALGO,
    encoding: ENCRYPTED_DATA_ENCODING,
    crypted,
  };

  const similarity = isSame(fileUID, content, compare) ? "identical" : "different";
  writeFileSync(`${DB_PATH}/${fileUID}.json`, JSON.stringify(fileData, null, 2), "utf-8");
  console.log(
    `${pc.cyan("✔ Operation succeed")} ${pc.magenta(`${uid}`)}`,
    " ",
    similarity === "different" ? pc.yellow("🆕 changed") : ""
  );

  return {
    similarity,
    content,
  };
}
