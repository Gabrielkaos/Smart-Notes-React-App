const express = require('express')
router = express.Router()

const authMiddleWare = require("../middleware/auth")
const {asyncHandler, AppError} = require("../middleware/errorHandler")

const logger = require("../utils/logger")
const {validateNote, validateNoteId} = require("../middleware/validation")

const {Note} = require("../models/index")



router.use(authMiddleWare)
//api/notes


router.get("/", asyncHandler(async (req, res)=>{
    const userId = req.user.userId

    // let query = "SELECT * FROM notes WHERE user_id = ? ORDER BY is_pinned DESC, created_at DESC"
    // const params = [userId]

    const notes = await Note.findAll({
      where:{userId},
      order: [
        ['is_pinned', 'DESC'],
        ['created_at', 'DESC']
      ]
    })

    // const notes = await dbAll(query, params)
    res.json({
        status:"success",
        results:notes.length,
        data:{notes}
    })
}))

router.get('/:id', validateNoteId, asyncHandler(async (req, res) => {
  const noteId = req.params.id
  const userId = req.user.userId

  const note = await Note.findOne({
    where:{id:noteId,userId}
  })

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

  const note = await Note.create({
    title,
    description : description || '',
    userId
  })

  logger.info(`Note created by user ${userId}: ${title}`)

  res.status(201).json({
    status: 'success',
    message: 'Note created successfully',
    data: {
      note
    }
  })
}))


router.put('/:id', [validateNoteId, validateNote], asyncHandler(async (req, res) => {
  const noteId = req.params.id
  const userId = req.user.userId
  const { title, description, is_pinned, is_archived, is_favorite } = req.body

  
  const note = await Note.findOne(
    {
      where:{id:noteId,userId}
    }
  )

  if (!note) {
    throw new AppError('Note not found', 404)
  }

  logger.info(`Update:Note Found:${noteId}`)

  logger.info(`UPDATEPARAMS:${title},${description},${is_pinned},${is_archived},${is_favorite},`)

  logger.info(`Update:Updating Note:${noteId}`)


  if(title !== 'no-title'){
    note.title = title
    note.version = note.version + 1
  }
  if (description !== undefined) note.description = description
  if (is_favorite !== undefined) note.isFavorite = is_favorite
  if (is_archived !== undefined) note.isArchived = is_archived
  if (is_pinned !== undefined) note.isPinned = is_pinned

  await note.save()

  logger.info(`Update:Note ${noteId} updated by user ${userId} 
    `)

  res.json({
    status: 'success',
    message: 'Note updated successfully',
    data: { note }
  })
}))

router.delete('/:id', validateNoteId, asyncHandler(async (req, res) => {
  const noteId = req.params.id
  const userId = req.user.userId

  const note = await Note.findOne({
    where:{id:noteId,userId}
  })

  if (!note) {
    throw new AppError('Note not found', 404)
  }

  await note.destroy()

  logger.info(`Note ${noteId} deleted by user ${userId}`)

  res.json({
    status: 'success',
    message: 'Note deleted successfully'
  })
}))




module.exports = router