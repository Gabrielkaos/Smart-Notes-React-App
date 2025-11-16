const express = require("express")
router = express.Router()

const config = require("../config/config")
const logger = require("../utils/logger")
const {dbRun, dbGet} = require("../database/database")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {asyncHandler, AppError} = require("../middleware/errorHandler")
const { validateRegister, validateLogin } = require('../middleware/validation')
const { authLimiter } = require('../middleware/security')


//api/auth/

router.use(authLimiter)

router.post("/register",validateRegister, asyncHandler(async (req, res)=>{
    const {username, password} = req.body

    const existingUser = await dbGet("SELECT * FROM users WHERE username = ?",[username])

    if (existingUser){
        throw new AppError("Username already exists", 400)
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)


    const result = await dbRun("INSERT INTO users (username, password) VALUES (?, ?)",[username, hashedPassword])

    const token = jwt.sign({userId:result.id, username},config.jwt.secret,{expiresIn:config.jwt.expire})

    logger.info(`New user registered ${username}`)

    res.status(201).json({
        status:"success",
        message:"New user registered",
        data:{
            token,
            user:{id:result.id,username}
        }
    })
}))

router.post("/login", async (req, res) => {
    const {username, password} = req.body

    const user = await dbGet('SELECT * FROM users WHERE username = ?',[username])

    if(!user){
        throw new AppError("Invalid credentials",401)
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new AppError("Password doesnt match", 401)
    }

    await dbRun("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",[user.id])

    const token = jwt.sign({userId:user.id, username},config.jwt.secret,{expiresIn:config.jwt.expire})

    logger.info(`Login successful ${user.username}`)

    res.json({
        status:"sucsess",
        message:"Login successful",
        data:{
            token,
            user:{id:user.id,username:user.username}
        }
    })
})


router.get("/profile",require("../middleware/auth"), asyncHandler(async (req, res)=>{
    const user = await dbGet("SELECT id, username, created_at, last_login FROM users WHERE id = ?",[req.user.userId])

    if(!user){
        throw new AppError("User not found",404)
    }

    res.json({
        status:"success",
        data:{user}
    })
}))

module.exports = router