require("dotenv").config()


module.exports = {
    server:{
        port:process.env.PORT,
        env:process.env.ENV
    },
    database:{
        path:process.env.DB_PATH
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expire: process.env.JWT_EXPIRE
    },
    cors: {
        origin: process.env.FRONTEND_URL
    },

    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS)
    },
    ai:{
        groqApiKey:process.env.API_KEY,
        model:'openai/gpt-oss-20b'
    }
}