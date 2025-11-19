const axios = require("axios")
const logger = require("../utils/logger")
const config = require('../config/config')


const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function summarizeNote(title, description){
    if (!config.ai.groqApiKey){
        throw new Error("No Ai API")
    }

    try{
        const prompt = `Summarize this note in one concise sentence (max 20 words)

            Title:${title}
            Description:${description}

            Summary:`

            const response = await axios.post(
                GROQ_API_URL,
                {
                    model: config.ai.model,
                    messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that summarizes notes concisely. Always respond with just the summary, no extra text.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                    ],
                    max_tokens: 100,
                    temperature: 0.3
                },
                {
                    headers: {
                    'Authorization': `Bearer ${config.ai.groqApiKey}`,
                    'Content-Type': 'application/json'
                    }
                }
            )

            const summary = response.data.choices[0].message.content.trim()
            logger.info("Summarized notes successfully")
            return summary
    }catch(error){
        logger.error('AI summarization error:', error.response?.data || error.message)
        throw new Error('Failed to generate summary')
    }
}

async function generateNoteSuggestions(notes) {
  if (!config.ai.groqApiKey) {
    throw new Error('AI service not configured')
  }

  try {
    const noteList = notes
      .slice(0, 10) 
      .map(n => `- ${n.title} (${n.description})`)
      .join('\n')

    const prompt = `Based on these notes, give 3 brief productivity tips:

${noteList}

Provide 3 short tips (max 15 words each):`

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: config.ai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a productivity coach. Give brief, actionable advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${config.ai.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const suggestions = response.data.choices[0].message.content.trim()
    logger.info('Note suggestions generated')
    return suggestions
  } catch (error) {
    logger.error('AI suggestions error:', error.response?.data || error.message)
    throw new Error('Failed to generate suggestions')
  }
}


async function analyzeTag(title, description) {
  if (!config.ai.groqApiKey) {
    throw new Error('AI service not configured')
  }

  try {
    const prompt = `Analyze this note and suggest tag:

Title: ${title}
Description: ${description}

Respond with ONLY one word:`

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: config.ai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a note tag suggestion expert. Respond with only one word'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 10,
        temperature: 0.3
      },
      {
        headers: {
          'Authorization': `Bearer ${config.ai.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const tag = response.data.choices[0].message.content.trim().toLowerCase()
   
    
    logger.info("Generated tag")
    return tag
  } catch (error) {
    logger.error('AI priority analysis error:', error.response?.data || error.message)
    return 'no-tag'
  }
}


async function generateDailySummary(notes) {
  if (!config.ai.groqApiKey) {
    throw new Error('AI service not configured')
  }

  try {
    const favorites = notes.filter(n => n.is_favorite).length
    const archives = notes.filter(n => n.is_archived).length
    const total = notes.length

    const noteList = notes
      .slice(0, 5)
      .map(n => `- ${n.title} (${n.description})`)
      .join('\n')

    const prompt = `Generate a motivational daily summary:

Stats: ${favorites}/${total} favorites, ${archives} archived

Recent notes:
${noteList}

Write a brief, encouraging summary (2-3 sentences):`

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: config.ai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a motivational productivity assistant. Be encouraging and specific.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${config.ai.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const summary = response.data.choices[0].message.content.trim()
    logger.info('Daily summary generated')
    return summary
  } catch (error) {
    logger.error('AI daily summary error:', error.response?.data || error.message)
    throw new Error('Failed to generate daily summary')
  }
}

module.exports = {
  summarizeNote,
  generateNoteSuggestions,
  analyzeTag,
  generateDailySummary
}