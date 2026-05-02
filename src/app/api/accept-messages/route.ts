import dbConnect from "../../../lib/db";
import UserModel from "@/model/UserModel";
import { authOptions } from "../auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 },
    );
  }

  const userId = user?._id;
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "falied to updated user status to accept messages",
        },
        { status: 401 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptence status updated successfully",
        updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("falied to updated user status to accept messages");
    return Response.json({
      success: false,
      message: "falied to updated user status to accept messages",
    });
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 },
    );
  }

  const userId = user?._id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: user.isAcceptingMessage,
        message: "acceptMessage got successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("acceptMessage getting failed");
    return Response.json(
      { success: false, message: "acceptMessage getting failed" },
      { status: 500 },
    );
  }
}

