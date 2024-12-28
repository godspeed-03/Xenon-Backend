import mongoose from "mongoose";

let connectionUrl;

if ( process.env.NODE_ENV === "test" ) {
  connectionUrl = process.env.MONGO_URL_TEST;
} else if ( process.env.NODE_ENV === "prod" ) {
  connectionUrl = process.env.MONGO_URL_PROD;
} else {
  connectionUrl = process.env.MONGO_URL_DEV;
}

console.log(connectionUrl)

async function connectDB() {
  try {
    await mongoose.connect( connectionUrl );

    console.log( "Database connected to the host" );
  } catch ( err ) {
    console.error( "Error occurred while connecting to DB :", err );
    process.exit( 1 );

    return;
  }

}

export default connectDB;
