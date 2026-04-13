const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



const SALT_ROUNDS = 10;


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Query DB (no callback) 
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        // 2. User check
        if(result.rows.longth === 0) {
            return res.redirect('/lgoin?User_not_found');
        }

        // User info from DB
        const user = result.rows[0];
        const email = user.email;

        // 3. Password check 
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.redirect('/login?Invalid_password');
        }

        // 3. Generate JWT
        const token = jwt.sign(
            { username, email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h'}
        );

        // 5. Set cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: process.env.NODE_ENV === 'production',
        });

        // 6. Redirect
        return res.redirect('/menu');
    } catch (error) {
        console.error('Login error: ', error);
        return res.redirect('/login?Server_error');
    }
};


exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Validate input
        if (!username || !email || !password) {
            return res.redirect('/login?Missing_required_fields');
        }

        // Hash password 
        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert into DB
        await pool.query(
            'INSERT INTO users(username, email, password) VALUES($1, $2, $3)',
            [username, email, hash]
        );

        // Create JWT
        const token = jwt.sign(
            { username, email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h'}
        );

        // Set cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        });

        return res.redirect('/menu');
    } catch (error) {
        console.error('Signup error: ', error);
        return res.redirect('/login?Signup_error');
    }
};


exports.logout = (req, res) => {
    res.clearCookie('authToken');
    res.redirect('/login?Logged_out');
};



exports.validateToken = async (req, res) => {
  const token = req.cookies.authToken;
  console.log("Token to validate: ", token);

  if (!token) {
    console.error("No token found!");
    return res.status(401).json(false);
  }

  const jwt_key = process.env.JWT_SECRET_KEY;
  jwt.verify(token, jwt_key, (err, decoded) => {
    if (!decoded) {
        console.log("Failed to token validation: ", err);
        return res.status(401).json(false);
    }
    console.log("Decoded Token: ", decoded);
    return res.status(200).json(decoded);
  });
};