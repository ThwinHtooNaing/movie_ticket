import mysql from "mysql2/promise";

export const mysqlPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "P@ssw0rd",
  database: "movie_tickets",
  waitForConnections: true,
  port: 3308,
  connectionLimit: 10,
});
