import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyUserJWT = async ( req, res, next ) => {
  try {
    const token = req.header( "Authorization" ).replace( "Bearer ", "" );
    if ( !token ) {
      throw new ApiError( 406, "Auth Identity is required" );
    }

    let decodedToken;

    jwt.verify( token, process.env.ACCESS_TOKEN_SECRET, ( err, decodedInfo ) => {
      if ( err ) {
        throw new ApiError( 401, `Invalid auth identity, ${err?.message}` );
      }
      decodedToken = decodedInfo;
    } );

    const Id = decodedToken._id;

    const user = await User.findOne( { _id: Id } )
      .select( "-password -refreshToken" )
      .lean();

    if ( !user ) {
      throw new ApiError( 401, "Invalid Auth identity" );
    }



    req.user = user
    next();

  } catch ( error ) {
    next( error );
  }
};

