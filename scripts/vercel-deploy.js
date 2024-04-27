const dotenv = require("dotenv");
dotenv.config();

const url = process.env.VERCEL_DEPLOYMENT_HOOK || "https://www.google.com";
fetch(url, {method: "POST"})
  .then((res) => res.text())
  .then(console.log);
