const ERRORS = {
  INVALID_COOKIE: new Error(`Invalid Php Session Id '${process.env.PHPSESSID}'`)
}

export default ERRORS;