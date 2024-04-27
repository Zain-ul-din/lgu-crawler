/**
 * Returns a promise that resolves when all promises in the array have resolved.
 * @param values An array of promises
 * @returns A promise that resolves to an array of resolved values
 */
export async function promisify<T>(values: Promise<T>[]) {
  return await Promise.all(values);
}

/**
 * Divides an array into smaller chunks based on the specified chunk size.
 * @param arr The array to be divided into chunks
 * @param chunks The number of chunks to create
 * @returns An array of arrays, each containing a chunk of the original array
 * @throws Error if number of chunks is less than or equal to 0
 */
export function chunkifyArray<T>(arr: T[], chunks: number) {
  if (chunks <= 0) throw new Error("Number of chunks should be greater than 0");

  const chunkSize = Math.ceil(arr.length / chunks);
  const res: Array<Array<T>> = [];

  for (let i = 0; i < arr.length; i += chunkSize) res.push(arr.slice(i, i + chunkSize));

  return res;
}

/**
 * Ensures that a given number falls within a specified range.
 * @param num The number to clamp
 * @param min The minimum value of the range
 * @param max The maximum value of the range
 * @returns The clamped value within the specified range
 */
export function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num;
}

/**
 * Checks whether a given string is a valid JSON string.
 * @param str The string to be checked
 * @returns true if the string is a valid JSON string, false otherwise
 */
export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
