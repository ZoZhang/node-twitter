const path = require("path");
const rootPath = path.normalize(__dirname + "/..");

const envPath = process.env.ENVPATH || ".env";
const dotenv = require("dotenv");
// Path to the file where environment variables
dotenv.config({path: envPath });

module.exports = {
  development: {
    db: process.env.DB,
    port: process.env.PORT,
    root: rootPath,
    app: {
      name: "Simple Twitter"
    }
  }
};
