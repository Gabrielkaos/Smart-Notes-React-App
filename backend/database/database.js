const sqlite3 = require("sqlite3").verbose()
const path = require('path')
const fs = require('fs')
const config = require('../config/config')
const logger = require('../utils/logger')

const dbDir = path.dirname(config.database.path);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new sqlite3.Database(config.database.path,(err)=>{
    if(err){
        logger.error("Error conecting to database",err)
        process.exit(1)
    }
    else{
        logger.info("Connected to Database")
        
    }
})


db.serialize(()=>{
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
        )
    `)

    db.run(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `)

    console.log("Tables Created")
})

module.exports = db