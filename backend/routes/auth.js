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