const OpenAI = require("openai")
require("dotenv").config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


class assistantController {
  static async createAssistant (req, res) {
    let {
      model,
      name,
      instructions
    } = req.body
    const newAssistant  = await openai.beta.assistants.create({
      model,
      name,
      instructions,
      tools: [
        {"type": "code_interpreter"}
        ],
    })

    res.status(200).json(newAssistant)
  }

  static async deleteAssistant(req, res) {
    let { id } = req.body
    
    const response = await openai.beta.assistants.del(id);

    res.status(201).json(response)
  }
}

module.exports = assistantController