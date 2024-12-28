import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "../config/cookieOptions.js";
import { sendOtpEmail } from "../utils/OtpEmail.js";
import { generateRefreshTokenAndAccessToken } from "./Token.controller.js";

export const verifyuserOtp = async ( req, res, next ) => {
  try {
    const { email, otp } = req.body;

    if ( !otp || !email ) {
      throw new ApiError( 406, "Email and Otp are required" );
    }

    const user = await User.findOne( { email } );

    if ( !user ) {
      throw new ApiError( 404, "User not found, Please sign up" );
    }
    if ( user.otp !== otp ) {
      throw new ApiError( 400, "Invalid or expired OTP" );
    }

    await User.updateOne(
      { email },
      {
        $set: { isVerified: true },
        $unset: { otp: 1, otpExpiresAt: 1 },
      }
    );

    // Generate tokens
    const { generatedrefreshToken, generatedaccessToken } =
      await generateRefreshTokenAndAccessToken( user._id );

    const loggedInUser = await User.findById( user._id ).select(
      "-password -refreshToken -otp -otpExpiresAt"
    );

    res
      .status( 200 )
      .cookie( "userRefreshToken", generatedrefreshToken, refreshTokenOptions )
      .cookie( "userAccessToken", generatedaccessToken, accessTokenOptions )
      .json( new ApiResponse( 200, {loggedInUser, generatedaccessToken, generatedrefreshToken}, "User verified successfully" ) );
  } catch ( err ) {
    next( err );
  }
};

export const getuserOtp = async ( req, res, next ) => {
  try {
    const { email } = req.body;

    if ( !email ) {
      throw new ApiError( 406, "Email is required" );
    }

    const user = await User.findOne( { email: email } );

    if ( !user ) {
      throw new ApiError( 404, "User not found, Please sign up" );
    }
    await sendOtpEmail( user._id, "otp" );

    return res
      .status( 202 )
      .json( new ApiResponse( 202, {}, "Otp sent successfully" ) );
  } catch ( err ) {
    next( err );
  }
};
