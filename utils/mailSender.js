import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailSender = async (email, subject, verifyUrl, btnText) => {
  const body = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 50px auto; padding: 20px; background-color: #fff; }
          .header { background-color: #4CAF50; color: #ffffff; padding: 10px; text-align: center; }
          .content { padding: 20px; text-align: center; }
          .button {padding: 10px 20px; margin-bottom:10px; font-size: 16px; cursor: pointer; text-align: center; text-decoration: none; color: #fff; background-color: #4CAF50; border: none; border-radius: 5px; box-shadow: 0 2px #999; text-decoration: none; }
          .footer { margin-top: 20px; text-align: center; font-size: 0.8em; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Our Blog!</h1>
          </div>
          <div class="content">
            <p>${subject}</p>
            <a href="${verifyUrl}" class="button">${btnText}</a>
          </div>
          <div class="footer">
            <p>If you did not request this verification, please ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
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
