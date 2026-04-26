// utils/db.js
import mysql from "mysql2/promise";

const isProduction = process.env.NODE_ENV === "production";

let dbConfig;

if (isProduction) {
  dbConfig = {
    host: process.env.TIDB_HOST,
    port: parseInt(process.env.TIDB_PORT || "4000"),
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE || "test",

    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },

    supportBigNumbers: true,
    bigNumberStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
} else {
  
  dbConfig = {
    host: process.env.MYSQL_HOST || "localhost",
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "movie_ticket",

    supportBigNumbers: true,
    bigNumberStrings: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

export const mysqlPool = mysql.createPool(dbConfig);


console.log(
  `[DB] Connected to: ${isProduction ? "TiDB Cloud (Production)" : "Local MySQL (Development)"}`,
);
