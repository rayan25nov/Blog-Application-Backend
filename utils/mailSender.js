import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email, subject, verifyUrl) => {
  const buttonStyle = `padding: 10px 20px; margin-bottom:10px; font-size: 16px; cursor: pointer; text-align: center; text-decoration: none; color: #fff; background-color: #4CAF50; border: none; border-radius: 5px; box-shadow: 0 2px #999;`;

  const body = `
    <div>
      <h1>Welcome to Our Service!</h1>
      <p>Please click the button below to verify your email address.</p>
      <a href="${verifyUrl}" style="${buttonStyle}">Verify</a>
    </div>
  `;

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
      to: email,
      subject: subject,
      html: body,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error.message);
  }
};

export default mailSender;
