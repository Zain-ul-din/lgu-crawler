export async function promisify<T>(values: Promise<T>[]) {
  return await Promise.all(values);
}

export function chunkifyArray<T>(arr: T[], chunks: number) {
  if (chunks <= 0) throw new Error("Number of chunks should be greater than 0");

  const chunkSize = Math.ceil(arr.length / chunks);
  const res: Array<Array<T>> = [];

  for (let i = 0; i < arr.length; i += chunkSize) res.push(arr.slice(i, i + chunkSize));

  return res;
}

export function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num;
}

export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
