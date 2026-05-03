import dbConnect from "@/lib/db";
import UserModel from "@/model/UserModel";
import { Message } from "@/model/UserModel";

export async function POST(request: Request) {
  await dbConnect();
  const { content, username } = await request.json();

  if (!content || !username) {
    return Response.json(
      { success: false, message: "content and username is empty" },
      { status: 401 },
    );
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "user not found" },
        { status: 401 },
      );
    }

    //if user not accept message
    if (user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user not accept your message",
        },
        { status: 400 },
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { success: true, message: "message sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("message sending Error", error);
    return Response.json(
      { success: false, message: "message sending Error" },
      { status: 500 },
    );
  }
}
