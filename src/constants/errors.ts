import ENV from "./env";

/**
 * Errors designed to provide clear feedback when certain conditions are not
 * met or unexpected behavior occurs.
 */
const ERRORS = {
  /**
   * This error is thrown when the provided PHP session ID (cookie) is invalid.
   */
  INVALID_COOKIE: new Error(`Invalid Cookie (Php Session Id) '${ENV.PHPSESSID}'`),
};

export default ERRORS;
