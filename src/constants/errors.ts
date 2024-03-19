import ENV from "./env";

const ERRORS = {
  INVALID_COOKIE: new Error(`Invalid Cookie (Php Session Id) '${ENV.PHPSESSID}'`),
};

export default ERRORS;
