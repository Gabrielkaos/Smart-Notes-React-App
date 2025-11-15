const express = require("express")
router = express.Router()

const db = require("../database")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

//api/auth/

router.post("/register", async (req, res)=>{
    const {username, password} = req.body


    if(!username || !password){
        return res.status(400).json({error:"Incomplete fields"})
    }

    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        db.run(`INSERT INTO users (username, password) VALUES (?, ?)`,
            [username,hashedPassword],
            (err)=>{
                if(err){
                    if(err.message.includes("UNIQUE")){
                        return res.status(400).json({error:"Username already exists"})
                    }else{
                        return res.status(500).json({error:"Database Error"})
                    }
                }
                //create token
                const token = jwt.sign({userId:this.lastID, username},process.env.SECRET,{expiresIn:"7d"})

                res.status(201).json({message:"Successfully registered",token,user:{id:this.lastID,username}})
            }
        )

    }catch(err){
        res.status(500).json({error:"Server Error"})
    }
})

router.post("/login", async (req, res) => {
    const {username, password} = req.body

    if(!username || !password){
        return res.status(400).json({error:"Incomplete fields"})
    }

    try{
        db.get(`SELECT * FROM users WHERE username = ?`,
            [username],
             async (err, user)=>{
                if(err){
                    return res.status(500).json({error:"Database Error"})
                }
                if(!user){
                    return res.status(401).json({error:"Invalid User"})
                }

                //compare password
                const isMatch = await bcrypt.compare(password,user.password)
                if(!isMatch){
                    return res.status(401).json({error:"Password doesnt match"})
                }

                const token = jwt.sign({userId:user.id,username},process.env.SECRET,{expiresIn:"7d"})

                res.status(201).json({message:"Login Successful",token,user:{id:user.id,username:user.username}})
            }
        )
    }catch(err){
        res.status(500).json({error:"Server Error"})
    }
})

module.exports = router