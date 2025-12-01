const express = require("express")
router = express.Router()

const config = require("../config/config")
const logger = require("../utils/logger")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {asyncHandler, AppError} = require("../middleware/errorHandler")
const { validateRegister, validateLogin } = require('../middleware/validation')
const { authLimiter } = require('../middleware/security')


//api/auth/

router.use(authLimiter)

router.post("/register",validateRegister, asyncHandler(async (req, res)=>{
    const {username, password} = req.body

    const existingUser = await User.findOne({
        where:{
            [require('sequelize').Op.or] : [ {username} ]
        }
    })

    if (existingUser){
        throw new AppError("Username already exists", 400)
    }

    const user = User.create({
        username,
        password
    })

    const token = jwt.sign({userId:user.id, username},config.jwt.secret,{expiresIn:config.jwt.expire})

    logger.info(`New user registered ${username}`)

    res.status(201).json({
        status:"success",
        message:"New user registered",
        data:{
            token,
            user:{id:user.id,username}
        }
    })
}))

router.post("/login",validateLogin, async (req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({
        where: { username, isActive: true}
    })

    if(!user){
        throw new AppError("Invalid credentials",401)
    }

    const isMatch = await user.comparePassword(password)
    if(!isMatch){
        throw new AppError("Password doesnt match", 401)
    }

    user.lastLogin = new Date()
    await user.save()

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
    const user = await User.findByPk(req.user.userId,{
        where:{exclude: ['password']}
    })

    if(!user){
        throw new AppError("User not found",404)
    }

    res.json({
        status:"success",
        data:{user}
    })
}))

module.exports = router