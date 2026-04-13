// const allowedOrigins = [
//     process.env.SELF_URL,
//     process.env.RECIPE_CLIENT_URL,
//     process.env.TASK_MGT_APP_URL,
//     process.env.CV_APP_URL,
//     process.env.CODEY_CLIENT_URL,
//     process.env.MUSIC_SEARCH_CLIENT_URL,
//     process.env.CHINESE_REST_CLIENT_URL,
//     process.env.HEALTH_CHECK_APP_URL,
// ];
const SELF_URL = 'https://auth-server-g01-0-9.onrender.com'
const RECIPE_CLIENT_URL = 'https://recipe-app-client-g01-0-9.netlify.app'
const TASK_MGT_APP_URL = 'https://task-appoint-app-g01-0-9.netlify.app'
const CV_APP_URL = 'https://cv-app-g01-0-9.onrender.com'
const CODEY_CLIENT_URL = 'https://codey-store-client-g01-0-9.netlify.app'
const MUSIC_SEARCH_CLIENT_URL = 'https://music-mgt-app-g01-0-9.netlify.app'
const CHINESE_REST_CLIENT_URL = 'https://restaurant-app-client-g01-0-9.netlify.app'
const HEALTH_CHECK_APP_URL = 'https://polite-semolina-a97790.netlify.app'
const allowedOrigins = [
    SELF_URL,
    RECIPE_CLIENT_URL,
    TASK_MGT_APP_URL,
    CV_APP_URL,
    CODEY_CLIENT_URL,
    MUSIC_SEARCH_CLIENT_URL,
    CHINESE_REST_CLIENT_URL,
    HEALTH_CHECK_APP_URL,
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