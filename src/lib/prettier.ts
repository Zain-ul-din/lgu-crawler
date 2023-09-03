
/**
 * Converts string to prettier format
 * @param title 
 * @param res 
 * @returns  
 */
export function toPrettierStr (title: string, res: string) {
return`
${title}
${new Array(100).fill('-').join('')}
${res}
${new Array(100).fill('-').join('')}
`    
}
