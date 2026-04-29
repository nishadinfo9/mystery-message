import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
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

    const existUserVerificationByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existUserVerificationByUsername) {
      return Response.json(
        {
          success: false,
          message: "username is already exist",
        },
        { status: 400 },
      );
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const existUserByEmail = await UserModel.findOne({ email });
    if (existUserByEmail) {
      if (existUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "user already verified with this email",
          },
          { status: 400 },
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existUserByEmail.password = hashedPassword;
        existUserByEmail.verifyCode = code;
        existUserByEmail.verifyCodeExpires = new Date(Date.now() + 3600000);
        await existUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: code,
        verifyCodeExpires: expiryDate,
        isAcceptingMessage: true,
        isVerified: false,
        messages: [],
      });

      await newUser.save();

      const emailResponse = await sendVerificationEmail(email, username, code);
      if (!emailResponse) {
        return Response.json(
          {
            success: false,
            message: "username is already taken",
          },
          { status: 500 },
        );
      }

      return Response.json(
        {
          success: true,
          message: "username created successfully. Please verify your email",
        },
        { status: 201 },
      );
    }
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
