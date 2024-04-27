import {existsSync, readFileSync} from "fs";
import {DB_PATH} from "./paths";
import {decrypt} from "./cipher";
import FileSchema from "./types/FileSchema";

/**
 * Reads data from the database file with the given UID.
 * @param uid The unique identifier of the data file to read.
 * @param decrypted If true, decrypts the data before returning.
 * @returns The data read from the database file, or an empty string if the file does not exist.
 */
export function readDB(uid: string, decrypted: boolean = true) {
  const filePath = `${DB_PATH}/${uid}.json`;
  if (!existsSync(filePath)) return "";
  const {crypted} = JSON.parse(readFileSync(filePath, "utf-8")) as FileSchema;
  return decrypted ? decrypt(crypted) : crypted;
}
