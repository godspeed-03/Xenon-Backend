import { generateOtp } from "./generateOtp.js";
import User from "../models/User.model.js";
import { transporter } from "../config/nodemailer.js";

export const sendOtpEmail = async ( userId, mailType ) => {
  try {

    const user = await User.findById( userId );

    const otpExpiresAt = new Date( Date.now() + 1 * 60 * 1000 );

    if ( process.env.NODE_ENV === "test" ) {
      const otp = "123456";

      await user.updateOne( { $set: { otp, otpExpiresAt } } );
    } else {
      const otp = generateOtp();

      console.log( otp );

      await user.updateOne( { $set: { otp, otpExpiresAt } } );

      const { email: useremail, fullName: name } = user;

      const mailConfig = {
        signup: {
          subject: `Welcome ${name}, Thanks for signing up. `,
          template: "SignUp",
          context: { username: name, otp },
        },
        login: {
          subject: `Welcome ${name}, Your account is not verified yet.`,
          template: "Login",
          context: { username: name, otp },
        },
        otp: {
          subject: `Hey ${name}, Here is your OTP.`,
          template: "Otp",
          context: { username: name, otp },
        },
      };

      const {
        subject: mailSubject,
        template: templateMail,
        context: emailcontext,
      } = mailConfig[mailType];

      const mailOptions = {
        from: "EventDTL - OTP <onboard@eventdtl.com>",
        to: useremail,
        subject: mailSubject,
        template: templateMail,
        context: emailcontext,
      };

      await transporter.sendMail( mailOptions );
    }
  } catch ( error ) {
    console.error( "Error sending OTP email:", error );
  }
};


export const rejectionmail = async (rejectionMsg, useremail) => {
  const mailOptions = {
    from: "EventDTL - Application rejected for Organiser",
    to: useremail,
    subject: "Application for Organsier - Rejected",
    template: RejectionMail,
    context: rejectionMsg,
  };

  await transporter.sendMail( mailOptions );
}