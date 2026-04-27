import { NextResponse } from "next/server";
import { mysqlPool as pool } from "@/utils/db";

export async function DELETE(request, { params }) {
  const { bookingId } = await params;

  try {
    const [result] = await pool.execute(
      "DELETE FROM bookings WHERE id = ?",
      [bookingId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
