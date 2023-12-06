import mongoose from "mongoose";
import mailSender from "../utils/mailSender.js";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 20,
  },
});

// Send Verification Email
const sendVerificationEmail = async (email, otp) => {
  // Send email using nodemailer
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from Blog Application",
      otp
    );
    console.log("Email sent Successfully", mailResponse);
  } catch (error) {
    console.log("Error occured while sending ");
    throw error;
  }
};

otpSchema.pre("save", async function (next) {
  // Send verification email
  await sendVerificationEmail(this.email, this.otp);
  next();
});

export default mongoose.model("Otp", otpSchema);
