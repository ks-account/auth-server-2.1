const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const corsOptions = require('./config/cors');
const globalMiddleware = require('./middleware/globalMiddleware');

const authRoutes = require('./routes/authRoutes');
const viewRoutes = require('./routes/viewRoutes');
const healthRoutes = require('./routes/healthRoutes');


const app = express();


app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(globalMiddleware);

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use('/', viewRoutes);
app.use('/', authRoutes);
app.use('/', healthRoutes);

// Rediret / to /login
app.get('/', (req, res) => {
    res.redirect('/login');
});

module.exports = app;