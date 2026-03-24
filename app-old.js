// Import express library
const express = require('express');
// Import json web token (JWT) library to use JWT 
const jwt = require('jsonwebtoken');
// Import cookie parser library to use cookie
const cookieParser = require('cookie-parser');
// Import CORS library to control network accesses
const cors = require('cors');
// Import path library to use __direname and some others
const path = require('path');
// Import pg library to use PostgreSQL
const { Pool } = require('pg');
// Import bcrypt library 
const bcrypt = require('bcrypt');
// Load environment variables from.env file
require('dotenv').config();
// Import url library to take query string
// const url = require('url');
// const { json } = require('body-parser');





// Create a express object
const app = express();

// Server listening port number
const PORT = process.env.SERVER_PORT;

// ****** URLs ******
// This Server
// const selfURL = 'https://auth-server-g01-0-9.onrender.com';
const selfURL = 'http://localhost:3115';
// const recipeClientURL = 'https://recipe-app-client-g01-0-9.netlify.app';
const recipeClientURL = 'http://localhost:5174';
// const taskMgtURL = 'https://task-appoint-app-g01-0-9.netlify.app';
const taskMgtURL = 'http://localhost:7676';
// const cvURL = 'https://cv-app-g01-0-9.onrender.com';
const cvURL = 'http://localhost:3905';
// const codeyClientURL = 'https://codey-store-client-g01-0-9.netlify.app';
const codeyClientURL = 'http://localhost:7678';
// const musicSearchURL = 'https://music-mgt-app-g01-0-9.netlify.app';
const musicSearchURL = 'http://localhost:5673';
// const chineseRestURL = 'https://restaurant-app-client-g01-0-9.netlify.app';
const chineseRestURL = 'http://localhost:5200';
// const healthCheckApp = 'https://polite-semolina-a97790.netlify.app';
const healthCheckApp = 'http://localhost:3901';

                
// Array of urls to be allowed to access to this server
const allowedOrigins = [
  // This server itself - Only required self to access others via this server itself
  // 'http://localhost:3111',
  selfURL,
  // Recipe Mgt App
  recipeClientURL,
  // Task Mgt App
  taskMgtURL,
  // CV app
  cvURL, 
  // Codey Web Store App 
  codeyClientURL, 
  // Music Search App
  musicSearchURL, 
  // Chinese Restaurant App
  chineseRestURL,
  // Health-check App
  healthCheckApp,
];
// CORS options object to specify allow-accesses either from the same origin or one of urls in the allowedOrigins
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);  // Allow the origin
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
// Set CORES with options
app.use(cors(corsOptions));

// Set cookie parser
app.use(cookieParser());

// Share public folder from both this server and clients/browsers
app.use(express.static('public'));

// !!!Enable to use json!!!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable to use ejs files in views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET_KEY;

// CREATE JWT CHECK MIDDLEWARE 
// KEEP CHECKING JWT IS VALID AND LOGOUT IF JWT IS EXPIRED!!!

// PostgreSQL configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// salt rounds for hashing
const SALT_ROUNDS = 10;

// Clear the last error message for the next use
app.use((req, res, next) => {
  // MSG_ARRAY.push("HELLO!", "MUST encrypt password with bcrypt!");
  // res.locals.messages = MSG_ARRAY;
  res.locals.message = "";
  next();
});




// ******************** ROUTES ********************
// Route for health-check for this server
app.get('/server-connection-test', (req, res) => {
  res.send(true);
});
// Router for health-check for DB on Supabase
app.get('/db-connection-test', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT 1'
    );  

    if(result) {
      console.log("DB is up!");
      res.send(true);
    } else {
      console.log("DB is down now...");
      res.send(false);
    }
  } catch(error) {
    console.error("System error while connecting to DB: ", error);
    res.send(false);
  }
});



app.get('/', (req, res) => {
  res.redirect('/login'); // Render login page
});

app.get('/login', (req, res) => {
  res.locals.pageTitle = "Login";
  res.locals.username = "";
  res.locals.isLogoutBtn = false;
  console.log("req.url: ", req.url);
  
  if(req.url) {
    let temp = new URL(req.url, selfURL).search;
    res.locals.message = temp.replace("?", "").replace(/_/g, " ");
  }

  res.render('login');
});

app.get('/signup', (req, res) => {
  res.locals.pageTitle = "Signup";
  res.locals.username = "";
  res.locals.isLogoutBtn = false;
  res.render('signup');
});


app.post('/health-check-page', (req, res) => {
  res.redirect('http://localhost:3901');
});


// Display Menu Page
app.get('/menu', authenticateToken, (req, res) => {
  // Retrieve the token from cookies
  const token = req.cookies.authToken; 
  console.log("Token in /menu: ", token);
  res.locals.pageTitle = "Menu";
  // Getting user info in token
  try {
    const result = jwt.verify(token, SECRET_KEY); 
    console.log("Token validated in '/menu': ", result);
    res.locals.username = "USER: " + result.username;
    res.locals.isLogoutBtn = true;
    res.status(200).render('menu');
  } catch (err) {
    res.status(404).redirect('login?Invalid_or_expired_token');
  }
});



// Token validation endpoint for React apps
app.post('/validate-token', (req, res) => {
  console.log("A request reached at /validate-token in Server");

  const token = req.cookies.authToken; // Retrieve the token from cookies
  console.log("Token is: ", token);

  // try {
  //   const result = jwt.verify(token, SECRET_KEY);
  //   console.log("Token is valid: ", result);
  //   // res.status(200).send(true); // Token is valid
  //   // res.sendStatus(200);
  //   res.status(200).send(result);
  // } catch (err) {
  //   console.log("Token is invalid: ", err);
  //   res.status(401).send(false); // Token is invalid or expired
  // }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json(false);
    }
    res.status(200).json(decoded);
  });
});




// ----- HELPER FUNCTIONS -----
// Cancel to use this helper function due to placed the similar within /menu route, this time
function authenticateToken(req, res, next) {
  const token = req.cookies.authToken;

  // Set cache control headers for all responses 
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (!token) {
    // If accessing a protected route without a token, redirect to login
    return res.status(401).redirect('/login?Please_log_in');
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log('JWT verification error:', err.message);
      res.clearCookie('authToken'); // Clear the invalid/expired cookie
      return res.status(403).redirect('/login?Session_expired_please_login_again');
    }

    // Make user info available in subsequent route handlers
    req.user = user; 
    
    next();
  });
}

module.exports = authenticateToken;
// ----- END HELPER FUNCTIONS -----



app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log("Received a request: ", username, ": ", password);

  // Validate username and password with DB data
  pool.query(
    'SELECT * FROM users WHERE username = $1',
    [username],
    (error, results) => {
      if(error) {
        console.error(error);
        // return res.status(500).send({msg: "Server error" + error + ". Please make sure DB is up!"});
        return res.status(500).redirect('/login?No_response_from_DB._Please_make_sure_DB_is_up.');
      }

      if(results.rows.length > 0) {
        console.log("username and password are valid!");
        console.log("User found: ", results.rows[0]);
        const users = results.rows[0];
        // Compare the password with the hashed password
        if(bcrypt.compare(password, users.password)) {
          console.log("password is valid!");
          // Generate a JWT token
          const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
          // Set the token as an httpOnly cookie
          res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production when using HTTPS
            sameSite: 'None', //'Lax', // Adjust depending on your requirements
            path: '/' // scope is all
          });
      
          // Redirect to the menu page
          res.status(200).redirect('/menu');
        }
      } else {
        res.locals.message = "Username or password doesn't exist in DB!";
        // res.status(404).render('login.ejs');
        res.status(404).redirect('/login?Username_not_found');
      }
    }
  );
});



app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  console.log("Received a signup request: ", username, ": ", email, ": ", password);
  if(!username || !email || !password) {
    console.error("Must provide all inputs in the page!");
    res.locals.message = "Either username, email, or password is empty.";
    return res.status(400).redirect('/login?Enter_all_required_fields');
  }

  // Generate salt and hash the password - async version
  bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    if(error) {
      console.error(error);
      res.status(500).send({msg: "Server error"});
    }
    // Insert user data into DB
    pool.query(
      'INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *',
      [username, email, hash],
      (error, results) => {
        if(error) {
          console.error(error);
          res.status(500).send({msg: "Server error"});
        }

        // Grant and send JWT ...
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        // Set the token as an httpOnly cookie
        res.cookie('authToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set to true in production when using HTTPS
          sameSite: 'None', //'Lax', // Adjust depending on your requirements
          path: '/' // all under /
        });
        

        console.log("User inserted successfully: ", results.rows[0]);
        res.locals.message = "User registration successful!";
        res.status(201).redirect('/menu');
      }
    );
  });
});



 // Route to logout. Either PORT or GET is fine in this case.
app.post ('/logout', (req, res) => {
  // Must set headers to prevent caching - w/o this, browser keep the cache automatically -> display the old page even after logout.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  console.log("A request to /logout: ", req.cookies.token);
  
  // ----- No req.session.destroy -----
  // This server doesn't use session for now. For better server control and security, add session.

  res.clearCookie('authToken', {
    httpOnly: true, // Prevents access from JavaScript in browsers
    secure: process.env.NODE_ENV === 'production',  // Match how it was set
    sameSite: 'None', //'Strict', // Match how it was set
    path: '/' // Good practice to specify the path
  });

  console.log("Completed to logout processes.");
  // Redirect to the login page (or a public landing page)
  // Redirect only works within the scope of server, which means not in the client.
  res.status(200).redirect('/login?Logged_out_successfully');
});







app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
