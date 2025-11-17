const express = require('express')
router = express.Router()

const authMiddleWare = require("../middleware/auth")
const {asyncHandler, AppError} = require("../middleware/errorHandler")
const {dbAll, dbGet, dbRun} = require("../database/database")
const logger = require("../utils/logger")
const {validateNote, validateNoteId} = require("../middleware/validation")



router.use(authMiddleWare)
//api/notes


router.get("/", asyncHandler(async (req, res)=>{
    const userId = req.user.userId

    let query = "SELECT * FROM notes WHERE user_id = ?"
    const params = [userId]

    const notes = await dbAll(query, params)
    res.json({
        status:"success",
        results:notes.length,
        data:{notes}
    })
}))

router.get('/:id', validateNoteId, asyncHandler(async (req, res) => {
  const noteId = req.params.id
  const userId = req.user.userId

  const note = await dbGet(
    'SELECT * FROM notes WHERE id = ? AND user_id = ?',
    [noteId, userId]
  )

  if (!note) {
    throw new AppError('Note not found', 404)
  }

  res.json({
    status: 'success',
    data: { note }
  })
}))

router.post('/', validateNote, asyncHandler(async (req, res) => {
  const { title, description} = req.body
  const userId = req.user.userId

  const result = await dbRun(
    `INSERT INTO notes (title, description, user_id) VALUES (?, ?, ?)`,
    [
      title,
      description || '',
      userId
    ]
  )

  logger.info(`Note created by user ${userId}: ${title}`)

  res.status(201).json({
    status: 'success',
    message: 'Note created successfully',
    data: {
      note: {
        id: result.id,
        title,
        description,
        user_id: userId
      }
    }
  })
}))


router.put('/:id', [validateNoteId, validateNote], asyncHandler(async (req, res) => {
  const noteId = req.params.id
  const userId = req.user.userId
  const { title, description, is_pinned, is_archived, is_favorite } = req.body

  
  const note = await dbGet(
    'SELECT * FROM notes WHERE id = ? AND user_id = ?',
    [noteId, userId]
  )

  if (!note) {
    throw new AppError('Note not found', 404)
  }

  logger.info(`Note Found:${noteId}`)

  logger.info(`Updating Note:${noteId}`)
  await dbRun(
    `UPDATE notes 
     SET title = ?, description = ?, version = ?, is_pinned = ?, is_archived = ?, is_favorite = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [
      title === "no-title" ? note.title:title,
      description !== undefined ? description : note.description,
      title === "no-title"?note.version:note.version+=1,
      is_pinned !== undefined ? is_pinned : note.is_pinned,
      is_archived !== undefined ? is_archived:note.is_archived,
      is_favorite !== undefined ? is_favorite:note.is_favorite,
      noteId
    ]
  )

  logger.info(`Note ${noteId} updated by user ${userId} 
    `)

  
  const updatedNote = await dbGet('SELECT * FROM notes WHERE id = ?', [noteId])

  res.json({
    status: 'success',
    message: 'Note updated successfully',
    data: { note: updatedNote }
  })
}))

router.delete('/:id', validateNoteId, asyncHandler(async (req, res) => {
  const noteId = req.params.id
  const userId = req.user.userId

  const result = await dbRun(
    'DELETE FROM notes WHERE id = ? AND user_id = ?',
    [noteId, userId]
  )

  if (result.changes === 0) {
    throw new AppError('Note not found', 404)
  }

  logger.info(`Note ${noteId} deleted by user ${userId}`)

  res.json({
    status: 'success',
    message: 'Note deleted successfully'
  })
}))




module.exports = router