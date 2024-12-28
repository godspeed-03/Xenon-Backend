import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath( import.meta.url );

const __dirname = path.dirname( __filename );

const folderpath = path.join( __dirname, "..", "./views/" );

export const transporter = nodemailer.createTransport( {
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
} );

const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve( folderpath ),
    defaultLayout: false,
  },
  viewPath: path.resolve( folderpath ),
  extName: ".hbs",
};

transporter.use( "compile", hbs( handlebarOptions ) );
