const cors = require("cors")
const express = require("express")
require("dotenv").config()

const authRoute = require("./routes/auth")
const authNote = require("./routes/notes")

app = express()
PORT = process.env.PORT

app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoute)
app.use("/api/notes",authNote)

app.get("/",(req, res)=>{
    res.json({message:"API"})
})

app.listen(PORT,()=>console.log(`Server listening on http://localhost:${PORT}`))