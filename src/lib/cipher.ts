import {createCipheriv, createDecipheriv} from "crypto";
import env from "./env";

const ALGO = "aes-256-cbc";

const getCredentials = () => ({
  key: Buffer.from(env.OPEN_DB_KEY || "", "hex"),
  iv: Buffer.from(env.OPEN_DB_IV || "", "hex"),
});

export function encrypt(data: string) {
  const {key, iv} = getCredentials();
  const cipher = createCipheriv(ALGO, key, iv);
  var crypted = cipher.update(data, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

export function decrypt(data: string) {
  const {key, iv} = getCredentials();
  const decipher = createDecipheriv(ALGO, key, iv);
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Appendix:
 *  openssl rand -hex <size>
 *  https://gist.github.com/aabiskar/c1d80d139f83f6a43593ce503e29964c
 */
