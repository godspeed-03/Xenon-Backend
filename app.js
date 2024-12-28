import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();


const corsOptions = {
  origin: 'https://xenon-client.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
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
