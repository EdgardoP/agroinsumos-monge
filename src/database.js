const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "agroinsumos_monge",
  multipleStatements: true,
});
module.exports = db;
