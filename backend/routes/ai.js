const express = require('express')
const { dbAll } = require('../database/database')
const authMiddleware = require('../middleware/auth')
const { asyncHandler, AppError } = require('../middleware/errorHandler')
const aiService = require('../services/aiServices')
const logger = require('../utils/logger')

const router = express.Router()


router.use(authMiddleware)


router.post('/summarize', asyncHandler(async (req, res) => {
  const { title, description } = req.body

  if (!title || !description) {
    throw new AppError('Title and description are required', 400)
  }

  const summary = await aiService.summarizeNote(title, description)

  res.json({
    status: 'success',
    data: { summary }
  })
}))

router.get('/suggestions', asyncHandler(async (req, res) => {
  const userId = req.user.userId

  const notes = await dbAll(
    'SELECT * FROM notes WHERE user_id = ? AND is_archived = 0 ORDER BY created_at DESC LIMIT 10',
    [userId]
  )

  if (notes.length === 0) {
    return res.json({
      status: 'success',
      data: { suggestions: 'Create some notes first to get personalized suggestions!' }
    })
  }

  const suggestions = await aiService.generateNoteSuggestions(notes)

  res.json({
    status: 'success',
    data: { suggestions }
  })
}))


router.post('/analyze-tag', asyncHandler(async (req, res) => {
  const { title, description } = req.body

  if (!title) {
    throw new AppError('Title is required', 400)
  }

  const tag = await aiService.analyzeTag(title, description || '')

  res.json({
    status: 'success',
    data: { tag }
  })
}))


router.get('/daily-summary', asyncHandler(async (req, res) => {
  const userId = req.user.userId

  const notes = await dbAll(
    `SELECT * FROM notes 
     WHERE user_id = ? 
     AND is_archived = 0 
     AND date(created_at) = date('now')
     ORDER BY created_at DESC`,
    [userId]
  )

  if (notes.length === 0) {
    return res.json({
      status: 'success',
      data: { summary: 'No notes created today. Start your productive day by adding some notes!' }
    })
  }

  const summary = await aiService.generateDailySummary(notes)

  res.json({
    status: 'success',
    data: { summary }
  })
}))

module.exports = router