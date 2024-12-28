import User from "../models/User.model.js";

export const generateRefreshTokenAndAccessToken = async ( Id ) => {

  const user =  await User.findById( Id );

  const generatedrefreshToken = user.generateRefreshToken();

  const generatedaccessToken = user.generateAccessToken();

  user.refreshToken = generatedrefreshToken;
  await user.save( { validateBeforeSave: false } );

  return { generatedrefreshToken, generatedaccessToken };

};
