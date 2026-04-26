import { resend } from "@/lib/resend";
import verificationEmail from "@/email/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "@resend.dev",
      to: email,
      subject: "mystery message | verification code",
      react: verificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "verification email send successfully",
    };
  } catch (emailError) {
    console.log("Error sending verification email:", emailError);
    return {
      success: false,
      message: "failed to send verification email",
    };
  }
}
