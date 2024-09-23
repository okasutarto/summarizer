const messageController = require("./../controller/message")

const OpenAI = require("openai")
require("dotenv").config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


class summarizeController {
  static async createSummary(req, res) {

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    const threadId = req.params.threadId
    
    const run = openai.beta.threads.runs.stream(threadId, {
      assistant_id: "asst_WLd20gtziAIRP8NbmeHneOzw"
    })
      .on('textCreated', () => res.write('event: textCreated\ndata: \n\n'))
      .on('textDelta', (textDelta) => res.write(`event: textDelta\ndata: ${JSON.stringify(textDelta)}\n\n`))
      .on('toolCallCreated', (toolCall) => res.write(`event: toolCallCreated\ndata: ${JSON.stringify(toolCall)}\n\n`))
      .on('toolCallDelta', (toolCallDelta) => res.write(`event: toolCallDelta\ndata: ${JSON.stringify(toolCallDelta)}\n\n`))
      .on('end', () => res.write('event: end\ndata: \n\n'));

    // Handle client disconnect
    req.on('close', () => {
      run.controller.abort();
    });
  }
}

module.exports = summarizeController