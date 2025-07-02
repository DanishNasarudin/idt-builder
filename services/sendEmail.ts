"use server";

import nodemailer from "nodemailer";
import { FormFields } from "../components/custom/quote/new-form";

export async function sendNodemail({
  template,
  data,
}: {
  template: string;
  data: FormFields;
}) {
  try {
    const transporter = nodemailer.createTransport({
      service: "v5787.securen.net",
      host: "v5787.securen.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
      pool: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOption = {
      from: `Ideal Tech PC <${process.env.EMAIL}>`,
      to: data.email,
      cc: process.env.EMAIL,
      replyTo: data.email,
      subject: `Custom PC Quotation: ${data.name}`,
      html: template,
    };

    // console.log(process.env.EMAIL, "success");
    await transporter.sendMail(mailOption);
  } catch (error) {
    throw new Error(error as string);
  }
}

export async function serverConsole(text: string) {
  console.log(text);
}
