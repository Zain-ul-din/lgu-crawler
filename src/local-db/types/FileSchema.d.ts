import {CIPHER_ALGO, ENCRYPTED_DATA_ENCODING} from "../cipher";

interface FileSchema {
  updated_at: Date | string;
  algo: typeof CIPHER_ALGO;
  encoding: typeof ENCRYPTED_DATA_ENCODING;
  crypted: string;
}

export default FileSchema;
