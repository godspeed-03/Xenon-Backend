import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

// app.use(
//   cors( {
//     origin: [
//       process.env.FRONTEND_URL_TEST,
//       process.env.FRONTEND_URL_DEV,
//       process.env.FRONTEND_URL_DEV1,
//       process.env.FRONTEND_URL_DEV2,
//       process.env.ADMIN_URL_DEV,
//       process.env.ADMIN_URL_DEV1,
//     ],
//     credentials: true,
//   } )
// );
const corsOptions = {
  origin: 'http://localhost:5500', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true, // Allow cookies to be included in requests
};

// Enable CORS with the defined options
app.use(cors(corsOptions));
app.use( cookieParser() );
app.use( express.json( { limit: "16kb" } ) );
app.use(
  express.urlencoded( {
    extended: true,
    limit: "16kb",
  } )
);

app.use( morgan( ":method :url :status - :response-time ms" ) );

app.get( "/", ( req, res ) => {
  res.status( 200 ).json( "Server Running successfully" );
} );

import userRouter from "./src/routes/User.routes.js";
import errorHandler from "./src/middleware/error.middleware.js";
import propertyRouter from "./src/routes/Property.routes.js";

app.use( "/api/v1/user", userRouter );
app.use("/api/v1/prop", propertyRouter)

app.use( errorHandler );

export default app;
