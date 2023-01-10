import nodemailer from "nodemailer";
import fs from "fs";
import { PropertyModelType } from "../db/models.js";
// import pug from "pug";

async function sendNotificationEmail(
  email: string,
  data: PropertyModelType,
  filePath: any
) {
  //! fix
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const UserAndPropertyData = { ...data };
  function emailMessage(data: any) {
    // const htmlTemp = fs.readFileSync(`${filePath}`, "utf-8");
    // const compiled = pug.compileFile(filePath);
    // console.log(compiled);
    // const output = compiled({ email_check: "uche" });
    // console.log(output);
    // return output;
  }
  emailMessage(UserAndPropertyData);

  console.log(email);
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: `${email}`,
    subject: `Certgo- Your Certificates are Ready`,
    html: ``,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return error.message;
    } else {
      console.log("Email sent: " + info.response);
      return info.response;
    }
  });
}

export { sendNotificationEmail };
