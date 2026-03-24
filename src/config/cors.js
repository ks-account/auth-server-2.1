const {    
    selfURL,
    recipeClientURL,
    taskMgtURL,
    cvURL,
    codeyClientURL,
    musicSearchURL,
    chineseRestURL,
    healthCheckApp } = require('./urlList');


const allowedOrigins = [
    selfURL,
    recipeClientURL,
    taskMgtURL,
    cvURL,
    codeyClientURL,
    musicSearchURL,
    chineseRestURL,
    healthCheckApp,
];


const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};


