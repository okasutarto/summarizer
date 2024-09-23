const OpenAI = require("openai")
require("dotenv").config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


class threadController {
  static async createThread(req, res) {
    const thread = await openai.beta.threads.create()

    res.status(200).json(thread)
  }
}

module.exports = threadController