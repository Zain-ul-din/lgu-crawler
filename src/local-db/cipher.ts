import {Encoding, createCipheriv, createDecipheriv, createHash} from "crypto";
import {ENV} from "../constants";
import assert from "assert";

export const CIPHER_ALGO = "aes-256-cbc";
export const ENCRYPTED_DATA_ENCODING: Encoding = "hex"

const getCredentials = () => ({
  key: Buffer.from(ENV.OPEN_DB_KEY || "", "hex"),
  iv: Buffer.from(ENV.OPEN_DB_IV || "", "hex"),
});

export function encrypt(data: string) {
  const {key, iv} = getCredentials();
  const cipher = createCipheriv(CIPHER_ALGO, key, iv);
  var crypted = cipher.update(data, "utf8", ENCRYPTED_DATA_ENCODING);
  crypted += cipher.final("hex");
  assert(data === decrypt(crypted), '❌ decryption fail')
  return crypted;
}

export function decrypt(data: string) {
  const {key, iv} = getCredentials();
  const decipher = createDecipheriv(CIPHER_ALGO, key, iv);
  let decrypted = decipher.update(data, ENCRYPTED_DATA_ENCODING, "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function hashStr(str: string) {
  return createHash("sha256").update(str).digest("hex");
}

/**
 * Appendix:
 *  openssl rand -hex <size>
 *  https://gist.github.com/aabiskar/c1d80d139f83f6a43593ce503e29964c
 */
