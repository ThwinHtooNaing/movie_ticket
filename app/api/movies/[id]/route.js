import { NextResponse } from "next/server";
import { getMovieById } from "@/utils/MovieQueries.js";

export async function GET(request, { params }) {
    const {id} = await params;
    console.log("Fetching movie with ID:", id);
  

  if (!id) {
    return NextResponse.json({ error: "Movie ID required" }, { status: 400 });
  }

  const movie = await getMovieById(id);

  if (!movie) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }

  return NextResponse.json(movie);
}
