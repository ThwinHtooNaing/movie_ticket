import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [cinema] = await mysqlPool.query("SELECT * FROM cinemas WHERE id = ?", [id]);
    if (!cinema) {
      return NextResponse.json({ success: false, message: "Cinema not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, cinema: cinema[0] });

    } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
