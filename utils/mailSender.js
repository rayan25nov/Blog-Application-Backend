import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email, subject, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "Blog Application",
      to: `${email}`,
      subject: `${subject}`,
      html: `${body}`,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error.message);
  }
};

export default mailSender;
