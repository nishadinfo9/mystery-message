import dbConnect from "@/lib/db";
import UserModel from "@/model/UserModel";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    if (!username || !email || !password) {
      return Response.json({ success: false, message: "all fieald are empty" });
    }

    const existUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existUser) {
      return Response.json(
        {
          success: false,
          message: "user already exist",
        },
        { status: 401 },
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    if (!hashPassword) {
      return Response.json(
        {
          success: false,
          message: "password hashing failed",
        },
        { status: 500 },
      );
    }

    const user = await UserModel.create({
      username,
      email,
      password: hashPassword,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user creation failed",
        },
        { status: 401 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "user created successfully",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error signup user", error);
    return Response.json(
      {
        success: false,
        message: "Error signup user",
      },
      { status: 500 },
    );
  }
}
