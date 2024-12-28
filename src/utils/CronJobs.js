import { schedule } from "node-cron";
import User from "../models/User.model.js";

const deleteOtp = async () => {
  const currentTime = new Date();

  try {
    await User.updateMany(
      { otpExpiresAt: { $lt: currentTime } },
      { $unset: { otp: 1, otpExpiresAt: 1 } }
    );
    console.log( "Expired OTPs removed for all users" );

  } catch ( error ) {
    console.error( "Error during cron job execution:", error );
  }
};

export const FiveminCronJob = schedule( "*/5 * * * *", () => {
  try {
    const currentTime = new Date();

    console.log( `Five minute Cron job executed at: ${currentTime}` );
    deleteOtp();
  } catch ( error ) {
    console.error( "Error during cron job execution:", error ); // Log the error
  }

} );

