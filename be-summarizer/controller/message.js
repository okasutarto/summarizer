const OpenAI = require("openai")
require("dotenv").config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class messageController {
  static async createMessage (req, res) {
    let {
      threadId,
      content
    } = req.body

    content =`"${content}"`

    const message = await openai.beta.threads.messages.create(
      threadId,
      {
        role: "user",
        content
      }
    )

    res.status(200).json(message)
  }
}

module.exports = messageController