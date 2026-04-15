import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET() {
  const [rows] = await mysqlPool.query("SELECT * FROM cinemas");
  return NextResponse.json(rows);
}
