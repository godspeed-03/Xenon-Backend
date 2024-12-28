export const accessTokenOptions = {
  httpOnly: true,
  secure: true,
  // sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, 
};
  
export const refreshTokenOptions = {
  httpOnly: true,
  secure: true,
  // sameSite: "none",
  maxAge: 30 * 24 * 60 * 60 * 1000, 
};
