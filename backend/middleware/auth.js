const jwt = require("jsonwebtoken")


const authMiddleWare = (req, res, next) => {
    try{
        //get token from request
        const token = req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            return res.status(401).json({error:"Invalid token"})
        }
        
        //decode the user
        const decoded = jwt.decode(token,process.env.SECRET)

        //append the user and then go on to the next route handler
        req.user = decoded

        next()

    }catch(err){
        res.status(401).json({error:"Invalid token"})
    }
}

module.exports = authMiddleWare