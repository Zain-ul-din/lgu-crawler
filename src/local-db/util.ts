import { readDB } from "./readDB"

export function isSame<T=any>(uid: string, content: T, compareCB?: (curr: T, previous: string)=> boolean) {
  const fileContent = readDB(uid)
  const contentToStr = typeof content === 'string' ? content : JSON.stringify(content)
  
  if(compareCB == undefined) 
    return fileContent === contentToStr 
  
  return compareCB(content, fileContent)
}
