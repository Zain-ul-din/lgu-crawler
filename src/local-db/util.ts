import { readDB } from "./readDB"

export function isSame(uid: string, content: any) {
  const fileContent = readDB(uid)
  const contentToStr = typeof content === 'string' ? content : JSON.stringify(content)
  return fileContent === contentToStr
}
