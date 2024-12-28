import { Router } from "express";
import {
  login,
  register,
  savequery,
} from "../controllers/User.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyUserJWT } from "../middleware/verifyJWT.middleware.js";
import { verifyuserOtp } from "../controllers/Otp.controller.js";
import { recommended } from "../controllers/recommedation.controller.js";

const userRouter = Router();

userRouter.route( "/register" ).post(
  upload.fields( [
    {
      name: "avatar",
      maxCount: 1,
    },
  ] ),
  register
);
userRouter.route( "/login" ).post( login );

// userRouter.route( "/logout" ).post( verifyUserJWT, logout ); //  secure

// userRouter.route( "/userdata" ).get( verifyUserJWT, getUser ); //  secure



userRouter.route( "/verifyotp" ).post( verifyuserOtp );
userRouter.route("/savequery").post(verifyUserJWT, savequery)
// userRouter.route("/getrecomdation").post(verifyUserJWT, recommended)

export default userRouter;
