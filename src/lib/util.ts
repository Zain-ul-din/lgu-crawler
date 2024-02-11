import { readdirSync, unlinkSync } from "fs"
import { join } from "path"

/**
    Stops the main thread for given time 
    @param number of seconds
**/
export async function delay(time: number) {
    await new Promise((resolve) => setTimeout(resolve, time * 1000));
}

export function sleep(milliseconds: number) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if (new Date().getTime() - start > milliseconds) {
            break;
        }
    }
}

export function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

/**
 * Returns true if string seems invalid
 * @param str 
 * @returns boolean  
 * @Example
 * ```diff
 * - 'Select Program' is invalid
 * - 'Program1 not BSSE Summer-2023 SE-Calculusavailable' is invalid
 * + 'BS Mass Comm' is valid
 * ```
 */
export function shouldExcludeStr(str: string | undefined) {

    const potentialInvalidFlags = [
        'not', 'select', 'available'
    ]

    return typeof str !== 'string' || str.length == 0 ||
        potentialInvalidFlags.filter(flag => str.toLocaleLowerCase().includes(flag)).length > 0
}

/**
 * removes all files from the given folder path
 * @param string path of folder
 */
export function clearFolder(folderPath: string) {
    readdirSync(folderPath).forEach(file=> unlinkSync(join (folderPath, file)))
}


