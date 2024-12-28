**Property Recommendation System with Full Authentication**
===========================================================

**Overview**
------------

This application provides a platform where users can register, log in, and receive personalized property recommendations. It features a secure authentication system using JSON Web Tokens (JWT) and stores user data and property information in MongoDB.

### **Key Features:**

1.  **User Authentication**:
    
    *   Registration and login via JWT tokens.
        
    *   Secure user sessions with access and refresh tokens.
        
2.  **Property Listings**:
    
    *   Users can view properties and receive recommendations based on their preferences.
        
    *   Each property is associated with various details (e.g., location, price, type, etc.).
        
3.  **Recommendation Engine**:
    
    *   AI-driven property recommendations based on user preferences and historical data.
        
4.  **Secure File Upload**:
    
    *   Users can upload avatars or other property-related images through Cloudinary.
        
5.  **Cron Jobs**:
    
    *   Expired OTPs and other periodic cleanups are handled by background cron jobs.
        

**Technologies Used**
---------------------

*   **Backend**: Node.js, Express.js
    
*   **Database**: MongoDB
    
*   **Authentication**: JWT (JSON Web Tokens)
    
*   **File Storage**: Cloudinary (for image uploads)
    
*   **Cron Jobs**: Node-Cron (for scheduled tasks)
    
*   **Email Service**: Nodemailer (for OTP emails)
    
*   **Security**: Bcrypt.js (for password hashing), Helmet.js (for HTTP headers)
    


# How to contribute setup server locally

Server is running on a public domain : `https://xenon-backend-1p9n.onrender.com`

This should be a pretty simple setup, as the app doesn't have many external service dependencies.

## Forking and Cloning the project

Development is on development branch. 

to clone a single branch development 

```
git clone  https://github.com/godspeed-03/Xenon-Backend

```


I suggest reading the [Github's guide on forking projects.](https://guides.github.com/activities/forking/)

<br />

## Visual Studio Code Setup

I also suggest using Visual Studio Code as your IDE, with the following extensions installed:

- ESLint
- Prettier - Code formatter

<br />

## Installing Node.js

The app depend on Node.js, a JavaScript runtime built on Chrome's V8 Engine.

You can download it here: https://nodejs.org/en/download/. The project currently supports version 18.17+

<br />

## Installing dependencies

Open the terminal on the root directory (I use the VSCode terminal) and do the following steps:

Go into the app directory

```
cd Xenon-Backend
```

Install dependencies using npm

```
npm i
```

This should add a _package-lock.json_ file and a _node_modules_ directory inside the _app_ directory.

<br />

## Environment Variables

Copy all the variables to configure the server

```
touch .env 
```
or create new .env file

**copy all envs to .env file**

<br />
<br />

**Finally! You're done with the setup and installation, now you can start the server**

## Running the development app

If you have done every step above, you're ready to start developing.

Make sure you're in the app directory, if you're not, run this command:

```
cd Xenon-Backend
```

And now you can start the app by running the command:

```
npm run dev
```

And there it is! You can now access the app at:

http://localhost:3700





**API Endpoints**
-----------------

### **User Routes (/api/v1/user)**

*   `POST /register`
    
    *   **Description**: Register a new user.
        
    *   **Request Body**: fullName, email, password, avatar (optional)
        
    *   **Response**: Success message or error message.
        
*   `POST /login`
    
    *   **Description**: Log in with email and password.
        
    *   **Request Body**: email, password
        
    *   **Response**: JWT access token and refresh token.
        
*   `POST /verifyotp`
    
    *   **Description**: Verify the OTP sent to the user's email.
        
    *   **Request Body**: otp
        
    *   **Response**: Success message if verified.
        
*   `POST /savequery`
    
    *   **Description**: Save a query or preference related to property search.
        
    *   **Middleware**: verifyUserJWT (ensures the user is authenticated)
        
    *   **Request Body**: queryData
        
    *   **Response**: Success message or error message.
        

### **Property Routes (/api/v1/prop)**

*   `GET /properties`
    
    *   **Description**: Fetch all available properties.
        
    *   **Response**: List of properties with detailed information.
        
*   `POST /recommendation`
    
    *   **Description**: Get property recommendations based on user preferences and past queries.
        
    *   **Request Body**: preferences (e.g., budget, location, type)
        
    *   **Response**: List of recommended properties.
        

**Authentication and Authorization**
------------------------------------

*   **JWT Authentication**:After logging in, the server returns an access token and refresh token. The access token is used to authenticate subsequent requests. If the access token expires, the refresh token can be used to obtain a new access token.
    
*   **Protected Routes**:Routes such as /savequery, /recommendation, and others are protected and require a valid JWT token to access. The verifyUserJWT middleware is used to check the token in the Authorization header.
    

**File Uploads**
----------------

*   **Cloudinary Integration**:Users can upload their avatar images through the /register route. These images are stored on Cloudinary and a URL to the uploaded image is saved in the database.
    

**Cron Jobs**
-------------

*   **Expired OTP Removal**:A cron job runs every 5 minutes to remove expired OTPs from the database. This ensures OTPs are only valid for a limited time and are cleaned up periodically.
    

**Error Handling**
------------------

*   **ApiError Class**:The application uses a custom ApiError class for structured error handling. This class allows different types of errors (e.g., authentication errors, validation errors) to be thrown and caught with specific status codes.
    
*   **Global Error Handler**:Any unhandled errors are caught and sent in a consistent format using the ApiResponse class.
    

**Security Measures**
---------------------

*   **Password Hashing**:Passwords are hashed using bcrypt before being stored in the database, ensuring secure storage of user credentials.
    
*   **JWT Expiry and Refresh Tokens**:JWT tokens have an expiry period (ACCESS\_TOKEN\_EXPIRY), and refresh tokens are used to obtain new access tokens once expired.
    
*   **Sensitive Information Handling**:All sensitive information, including JWT secrets and Cloudinary API keys, are stored in environment variables.
    

**Conclusion**
--------------

This Property Recommendation System provides a secure, scalable solution for users to register, log in, and receive personalized property recommendations. The system is built using modern tools and best practices, ensuring security and a smooth user experience.