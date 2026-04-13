const allowedOrigins = [
    process.env.SELF_URL,
    process.env.RECIPE_CLIENT_URL,
    process.env.TASK_MGT_APP_URL,
    process.env.CV_APP_URL,
    process.env.CODEY_CLIENT_URL,
    process.env.MUSIC_SEARCH_CLIENT_URL,
    process.env.CHINESE_REST_CLIENT_URL,
    process.env.HEALTH_CHECK_APP_URL,
];



const corsOptions = {
    origin: function (origin, callback) {
        console.log("Current request origin: ", origin);
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};


module.exports = corsOptions;