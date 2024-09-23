const OpenAI = require("openai")
require("dotenv").config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


class assistantController {
  static async assistant(req, res) {
    let { content } = req.body
    content =`"${content}"`
    
    const assistant  = await openai.beta.assistants.create({
      model: "gpt-4o-mini",
      name: 'Article Summarizer',
      // instructions: `You are a article summarizer machine. Craft a summary for ${content} that is detailed, thorough, in-depth, and complex, while maintaining clarity and conciseness. If the ${content} not related to article, Just describe what is ${content}`,
      instructions: `You are a article summarizer machine. Summarize the context of ${content}  that is detailed, thorough, in-depth, and complex, while maintaining clarity and conciseness.If the ${content} is a question, Just describe the question without giving the result`,
      tools: [
        {"type": "code_interpreter"}
        ],
    })

    const thread = await openai.beta.threads.create()

    const message = await openai.beta.threads.messages.create(
      thread.id,
      {
        role: "user",
        content
      }
    );

    let run = await openai.beta.threads.runs.createAndPoll(
      thread.id,
      { 
        assistant_id: assistant.id,
        instructions: `You are a article summarizer machine. Summarize the context of ${content}  that is detailed, thorough, in-depth, and complex, while maintaining clarity and conciseness.If the ${content} is a question, Just describe the question without giving the result`
      }
    );

    const messages = await openai.beta.threads.messages.list(
      run.thread_id
    );
    // if (run.status === 'completed') {
    // for (const message of messages.data.reverse()) {
    //   console.log(`${message.content[0].text.value}`);
    // }
    // } else {
    //   console.log(run.status);
    // }

    res.status(200).json({
      data: messages.data[0].content[0].text.value
    })
  }
}

module.exports = assistantController