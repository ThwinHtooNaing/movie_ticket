// app/api/movies/route.js
import { NextResponse } from "next/server";
import { queryBuilder } from "@/utils/paginate";
import { mysqlPool } from "@/utils/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || undefined;

    const filters = {};
    if (searchParams.get("genre")) filters.genre = searchParams.get("genre");

    const result = await queryBuilder({
      connection: mysqlPool,
      table: "movies",
      page,
      limit,
      search,
      searchColumns: ["name", "title"],
      filters,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
