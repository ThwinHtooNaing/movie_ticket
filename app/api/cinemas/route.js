import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import { queryBuilder } from "@/utils/paginate";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || undefined;

    const filters = {};
    if (searchParams.get("district")) {
      filters.district = searchParams.get("district");
    }

    const result = await queryBuilder({
      connection: mysqlPool,
      table: "cinemas",
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
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

