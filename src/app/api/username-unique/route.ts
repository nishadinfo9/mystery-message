import UserModel from "@/model/UserModel";
import dbConnect from "@/lib/db";
import { usernameSchema } from "@/schema/signUpSchema";
import * as z from "zod";

const usernameQuerySchema = z.object({
  username: usernameSchema,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = usernameQuerySchema.safeParse(queryParam);
    console.log("username result:", result);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(", ")
              : "Invalid query paramiters",
        },
        { status: 400 },
      );
    }

    const username = result.data?.username;

    const existUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existUsername) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "username is uique",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 },
    );
  }
}
