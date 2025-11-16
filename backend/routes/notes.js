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
    const { priority, sort = 'created_at', order = 'DESC' } = req.query;

    let query = "SELECT * FROM notes WHERE user_id = ?"
    const params = [userId]

    if(priority){
        query += ' AND priority = ?'
        params.push(priority)
    }

    const allowedSort = ['created_at', 'updated_at', 'due_date', 'priority', 'title']
    const allowedOrder = ['ASC', 'DESC']

    if (allowedSort.includes(sort) && allowedOrder.includes(order.toUpperCase())) {
        query += ` ORDER BY ${sort} ${order}`
    }

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
  const { title, description, priority } = req.body
  const userId = req.user.userId

  const result = await dbRun(
    `INSERT INTO notes (title, description, priority, user_id) 
     VALUES (?, ?, ?, ?)`,
    [
      title,
      description || '',
      priority || 'medium',
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
        priority: priority || 'medium',
        user_id: userId
      }
    }
  })
}))


router.put('/:id', [validateNoteId, validateNote], asyncHandler(async (req, res) => {
  const noteId = req.params.id
  const userId = req.user.userId
  const { title, description, priority } = req.body

  
  const note = await dbGet(
    'SELECT * FROM notes WHERE id = ? AND user_id = ?',
    [noteId, userId]
  )

  if (!note) {
    throw new AppError('Note not found', 404)
  }

  
  await dbRun(
    `UPDATE notes 
     SET title = ?, description = ?, priority = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [
      title || task.title,
      description !== undefined ? description : task.description,
      priority || task.priority,
      noteId
    ]
  )

  logger.info(`Note ${noteId} updated by user ${userId}`)

  
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


router.get('/stats/summary', asyncHandler(async (req, res) => {
  const userId = req.user.userId

  const stats = await dbGet(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) as high_priority,
     FROM tasks WHERE user_id = ?`,
    [userId]
  )

  res.json({
    status: 'success',
    data: { stats }
  })
}))

module.exports = router