import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fileuploadcontroller } from "../utils/Cloudinary.js";
import jwt from "jsonwebtoken";
import { sendOtpEmail } from "../utils/OtpEmail.js";
import { generateRefreshTokenAndAccessToken } from "./Token.controller.js";
import {
  accessTokenOptions,
  refreshTokenOptions,
} from "../config/cookieOptions.js";
import mongoose from "mongoose";

export const register = async (req, res, next) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    const { fullName, email, password } = req.body;

    if ([fullName, email, password].some((field) => !field.trim())) {
      throw new ApiError(406, "All fields are required");
    }

    const existbyemail = await User.findOne({ email: email });

    if (existbyemail) {
      throw new ApiError(
        400,
        "User already exists with the email, Please login"
      );
    }

    let avatarPath = {
      url: "http://res.cloudinary.com/dphwk3hos/image/upload/v1731669869/j0eqqqltrtsvuywnnc62.jpg",
    };

    if (req.files?.avatar) {
      const localAvatarFile = req.files.avatar[0]?.path;

      avatarPath = await fileuploadcontroller(localAvatarFile);

      if (!avatarPath) {
        throw new ApiError(408, "Unable to upload avatar. Please try again");
      }
    }

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: password,
      avatar: avatarPath?.url,
      isVerified: false,
    });

    await newUser.save({ session });

    if (!newUser) {
      throw new ApiError(500, " Something went wrong while creating user");
    }

    await session.commitTransaction();
    session.endSession();

    await sendOtpEmail(newUser._id, "signup");

    const createduser = await User.findById(newUser._id).select(
      "-password -refreshToken -otp -otpExpiresAt"
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { email: createduser.email },
          "User registered successfully, Please verify your email"
        )
      );
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      throw new ApiError(406, "Email and Password are required");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new ApiError(404, "User not found, Please sign up");
    }

    if (!user.isVerified) {
      await sendOtpEmail(user._id, "login");

      res.status(203).json(
        new ApiResponse(
          203,
          {
            email: user.email,
          },
          "User is not verified, Please verify"
        )
      );
    } else {
      const correctPassword = await user.isPasswordCorrect(password);

      if (!correctPassword) {
        throw new ApiError(
          400,
          "Incorrect password, please enter the correct password"
        );
      }

      const { generatedrefreshToken, generatedaccessToken } =
        await generateRefreshTokenAndAccessToken(user._id);

      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -otp -otpExpiresAt"
      );

      res
        .status(200)
        .cookie("userRefreshToken", generatedrefreshToken, refreshTokenOptions)
        .cookie("userAccessToken", generatedaccessToken, accessTokenOptions)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
            },
            "User logged in successfully"
          )
        );
    }
  } catch (error) {
    next(error);
  }
};

// export const logout = async (req, res, next) => {
//   try {
//     await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         $unset: {
//           refreshToken: "",
//         },
//       },
//       {
//         new: true,
//       }
//     );

//     return res
//       .status(202)
//       .cookie("userRefreshToken", "", refreshTokenOptions)
//       .cookie("userAccessToken", "", accessTokenOptions)
//       .json(new ApiResponse(202, {}, "User logged out successfully"));
//   } catch (error) {
//     next(error);
//   }
// };

// export const getUser = async (req, res, next) => {
//   try {
//     return res
//       .status(200)
//       .json(new ApiResponse(200, req.user, "User is fetched successfully"));
//   } catch (error) {
//     next(error);
//   }
// };

export const savequery = async (req, res, next) => {
  try {
    const { searchQuery } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user && !user.searchHistory.includes(searchQuery)) {
      user.searchHistory.push(searchQuery);
      await user.save();
      return res.status(200).json(200, {}, "Search query saved successfully");
    } else {
      throw new ApiError(406, "Search query already exists");
    }
  } catch (err) {
    next(err);
  }
};
