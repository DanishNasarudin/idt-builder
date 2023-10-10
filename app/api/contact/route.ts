import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest, res: NextResponse) {
  // return NextResponse.json({
  //   status: "ok",
  // });
  const data = await req.json();
  console.log(data);
  if (
    !data.name ||
    !data.email ||
    !data.contact ||
    !data.state ||
    !data.reason
  ) {
    return NextResponse.json({ message: "Bad request" }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "v5787.securen.net",
      host: "v5787.securen.net",
      port: 465,
      secure: true,
      auth: {
        user: "danish@idealtech.com.my",
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOption = {
      from: "danish@idealtech.com.my",
      to: "danish@idealtech.com.my",
      replyTo: data.email,
      subject: `Custom PC Quotation: ${data.name}`,
      html: data.formData,
    };

    // transporter.verify(function (error: any, success: any) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Server is ready to take our messages");
    //   }
    // });

    await transporter.sendMail(mailOption);
    return NextResponse.json({ message: "Email Sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Bad request" }, { status: 500 });
  }
}
