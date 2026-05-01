import dbConnect from "@/lib/db";
import UserModel from "@/model/UserModel";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "user not found" },
        { status: 401 },
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpiry = new Date(user.verifyCodeExpires) > new Date();

    if (isCodeValid && isCodeNotExpiry) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 },
      );
    } else if (!isCodeNotExpiry) {
      return Response.json(
        {
          success: false,
          message:
            "vefification code has expired. please signup again to get a new code",
        },
        { status: 400 },
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code ",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error verifying code", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying code",
      },
      { status: 500 },
    );
  }
}
