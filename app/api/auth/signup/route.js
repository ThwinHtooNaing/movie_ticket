import { NextResponse } from "next/server";
import { mysqlPool as pool } from "@/utils/db";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "This email is already registered" },
        { status: 400 },
      );
    }

    const userId =
      BigInt(Date.now()) * 100000n + BigInt(Math.floor(Math.random() * 100000));

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const avatarsPath = path.join(process.cwd(), "public/avatars");
    let avatarFiles = [];

    try {
      avatarFiles = fs
        .readdirSync(avatarsPath)
        .filter(
          (file) =>
            file.toLowerCase().endsWith(".jpg") ||
            file.toLowerCase().endsWith(".jpeg"),
        );
    } catch (err) {
      console.error("Could not read avatars folder:", err);
      avatarFiles = ["default.jpg"]; 
    }

    const randomAvatar =
      avatarFiles[Math.floor(Math.random() * avatarFiles.length)];
    const img_url = `/avatars/${randomAvatar}`;

    
    const [result] = await pool.query(
      `INSERT INTO users (id,name, email, password_hash, img_url) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId,name, email, password_hash, img_url],
    );

    
    return NextResponse.json({
      success: true,
      user: {
        id: userId.toString(),
        name: name,
        email: email,
        img_url: img_url,
      },
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 },
    );
  }
}
