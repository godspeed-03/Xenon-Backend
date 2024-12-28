import connectDB from "./src/DB/ConnectToDB.js";
import app from "./app.js";
import { FiveminCronJob } from "./src/utils/CronJobs.js";
import addProperties from "./src/models/func.js";

const PORT = process.env.PORT || 3700;

connectDB()
  .then( () => {
    app.listen( PORT, () => {
      console.log( `Server started on port ${PORT} by worker PID: ${process.pid}` );
    } );
    // addProperties();
    FiveminCronJob.start();
    console.log( "Five min. CRON JOB started" );
  } )
  .catch( ( err ) => {
    console.log( `Error starting the server: ${err}` );
  } );
