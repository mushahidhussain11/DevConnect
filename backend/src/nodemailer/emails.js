import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import "dotenv/config";
// import nodemailer from "nodemailer";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);


// const transporter = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com',
//   port: 587,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

export const sendPasswordResetEmail = async function (email, resetURL) {
  const recipient = [{ email }];
  console.log(recipient);
 

  try {
    // const response = await transporter.sendMail({
    //   from: `"Dev Connect" <${process.env.SMTP_USER}>`,
    //   to: email,
    //   subject: "Reset your password",
      // html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    // });

     const response = await resend.emails.send({
      from: 'DevConnect <onboarding@resend.dev>', // or your verified domain
      to: email,
      subject: 'Reset Your Password',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });


    return response;

    console.log('Email sent:', response);


  } catch (error) {
    console.error(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
};



export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await resend.emails.send({
			from: 'DevConnect <onboarding@resend.dev>',
			to: email,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};