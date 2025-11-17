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
        initializeDatabase()
    }
})

db.run('PRAGMA foreign_keys = ON')

function initializeDatabase(){
    db.serialize(()=>{
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            last_login DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `,(err)=>{
            if(err){
                logger.error("Error creating user table",err)
            }else{
                logger.info("Created users table")
            }
        })

        db.run(`CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            user_id INTEGER NOT NULL,
            version INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `,(err)=>{
            if(err){
                logger.error("Error creating notes table",err)
            }else{
                logger.info("Created notes table")
            }
        })

        db.run('CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)');
    })
}


const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        logger.error('Database query error:', err)
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        logger.error('Database query error:', err)
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        logger.error('Database query error:', err)
        reject(err)
      } else {
        resolve({ id: this.lastID, changes: this.changes })
      }
    })
  })
}


process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      logger.error('Error closing database:', err)
    } else {
      logger.info('Database connection closed')
    }
    process.exit(0)
  })
})

module.exports = {
  db,
  dbAll,
  dbGet,
  dbRun
};