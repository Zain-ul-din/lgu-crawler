import {CIPHER_ALGO, ENCRYPTED_DATA_ENCODING} from "#/cipher";

/**
 * Represents the schema of a JSON file.
 */
interface FileSchema {
  /** The date when the file was last updated. */
  updated_at: Date | string;
  /** The encryption algorithm used to encrypt the file data. */
  algo: typeof CIPHER_ALGO;
  /** The encoding used for the encrypted data. */
  encoding: typeof ENCRYPTED_DATA_ENCODING;
  /** The encrypted data stored in the file. */
  crypted: string;
}

export default FileSchema;
