const express = require('express')
router = express.Router()

const authMiddleWare = require("../middleware/auth")
router.use(authMiddleWare)

const db = require("../database")


//api/notes

router.get("/",(req, res)=>{
    const userId = req.user.userId
    db.all("SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC",
        [userId],
        (err, notes)=>{
            if(err){
                return res.status(500).json({error:"Database error"})
            }

            res.json({notes})
        }
    )
})

router.get("/:id",(req, res)=>{
    const userId = req.user.userId
    const noteId = req.params.id
    db.get("SELECT * FROM notes WHERE user_id = ? AND id = ?",
        [userId,noteId],
        (err, note)=>{
            if(err){
                return res.status(500).json({error:"Database error"})
            }
            if(!note){
                return res.status(401).json({error:"Note doesnt exist"})
            }

            res.json({note})
        }
    )
})

router.post("/",(req, res)=>{
    const {title, description} = req.body
    const userId = req.user.userId

    db.run("INSERT INTO notes (title, description, user_id) VALUES (?, ?, ?)",
        [title, description || '',userId],
        (err)=>{
            if(err){
                return res.status(500).json({error:"Database error"})
            }
            res.status(201).json({
                message:"Notes created successfully",
                note:{id:this.lastID, title, description:description || "", user_id:userId}
            })
        }
    )

})

router.put("/:id",(req, res)=>{
    const noteId = req.params.id
    const userId = req.user.userId
    const {title, description} = req.body
    
    db.get("SELECT * FROM notes WHERE id = ? AND user_id = ?",
        [noteId,userId],
        (err,note)=>{
            if(err){
                return res.status(500).json({error:"Database error"})
            }
            if(!note){
                return res.status(401).json({error:"Note doesnt exist"})
            }

            db.run("UPDATE notes WHERE id = ? SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP",
                [noteId,
                 title || note.title,
                 description !== undefined ? description:note.description
                ],(err)=>{
                    if(err){
                        return res.status(500).json({error:"Updating error"})
                    }

                    res.status(201).json({
                        message:"Updated Successfully",
                        note:{id:note.id,title:title || note.title, description:description !== undefined ? description:note.description}
                    })
                }
            )
        }
    )

})

router.delete("/:id",(req, res)=>{
    const userId = req.user.userId
    const noteId = req.params.id
    db.run("DELETE FROM notes WHERE user_id = ? AND id = ?",
        [userId,noteId],
        (err, note)=>{
            if(err){
                return res.status(500).json({error:"Deletion error"})
            }
            if(this.changes === 0){
                return res.status(404).json({error:"Note not found"})
            }

            res.json({message:"Deleted Successfully"})
        }
    )
})

module.exports = router