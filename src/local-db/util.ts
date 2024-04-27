import {readDB} from "./readDB";

/**
 * Checks if the content is the same as the data stored in the database file with the given UID.
 * @param uid The unique identifier of the database file.
 * @param content The content to compare with the data in the database file.
 * @param compareCB An optional callback function to customize the comparison logic.
 * @returns true if the content is the same as the data in the database file, false otherwise.
 */
export function isSame<T = any>(uid: string, content: T, compareCB?: (curr: T, previous: string) => boolean) {
  const fileContent = readDB(uid);
  const contentToStr = typeof content === "string" ? content : JSON.stringify(content);

  if (compareCB == undefined) return fileContent === contentToStr;

  return compareCB(content, fileContent);
}
