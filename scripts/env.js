/**
 * use to create .env file if using github codespaces which automatically provides env variables in process.env object
 */

const {writeFileSync, existsSync} = require("fs");
const ENV_PATH = process.cwd() + "./.env";
const DEFAULT_PLACEHOLDER = "YOUR_VALUE";

if (process.env !== 'production') process.exit(0);

writeFileSync(
  `${process.cwd()}/.env`,
  `\
NODE_ENV=${process.env.NODE_ENV || DEFAULT_PLACEHOLDER}
OPEN_DB_KEY=${process.env.OPEN_DB_KEY || DEFAULT_PLACEHOLDER}
OPEN_DB_IV=${process.env.OPEN_DB_IV || DEFAULT_PLACEHOLDER}
PHPSESSID=${process.env.PHPSESSID || DEFAULT_PLACEHOLDER}
`
);
