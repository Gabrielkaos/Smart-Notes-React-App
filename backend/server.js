const cors = require("cors")
const express = require("express")
const logger = require("./utils/logger")
const config = require("./config/config")
const { errorHandler, notFound } = require("./middleware/errorHandler")
const {limiter, securityHeaders, xss} = require("./middleware/security")

const authRoute = require("./routes/auth")
const authNote = require("./routes/notes")


app = express()


app.set('trust proxy', 1);

//security
app.use(securityHeaders)
app.use(limiter)

app.use(cors({
    origin:config.cors.origin,
    credentials:true
}))

app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({limit:"10mb",extended:true}))

//data
// app.use(mongoSanitize)
// app.use(xss)


app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  })
  next()
})

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.env
  })
})

app.use("/api/auth",authRoute)
app.use("/api/notes",authNote)

app.get('/', (req, res) => {
  res.json({
    message: 'Note Manager API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      notes: '/api/notes'
    }
  })
})

//404 handler
app.use(notFound)

//error handler
app.use(errorHandler)


const PORT = config.server.port
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`)
  logger.info(`Environment: ${config.server.env}`)
});