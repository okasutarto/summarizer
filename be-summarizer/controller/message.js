const fs = require('fs');
const pdf = require('pdf-parse');

const OpenAI = require("openai")
require("dotenv").config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class messageController {
  static async createMessage(req, res) {
    try {
      const { threadId, text } = req.body;
      const images = req.files['images'] || [];
      const docs = req.files['docs'] || [];

      const messageContent = await messageController.buildMessageContent(text, docs, images);

      await messageController.sendMessageToOpenAI(threadId, messageContent);

      res.status(201).json("Message created successfully");
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json("Error creating message");
    } finally {
      await messageController.deleteFiles(req.files);
    }
  }

  static async buildMessageContent(text, docs, images) {
    let messageContent = [];

    if (text) {
      messageContent.push({
        type: 'text',
        text: `"${text}"`,
      });
    }

    if (docs && docs.length > 0) {
      const pdfContent = await messageController.extractPdfContent(docs[0].path);
      messageContent = [{
        type: 'text',
        text: pdfContent,
      }];
    }

    if (images && images.length > 0) {
      messageContent = await messageController.processImages(images);
    }

    return messageContent;
  }

  static async extractPdfContent(filePath) {
    const dataBuffer = await fs.promises.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  static async processImages(images) {
    const imageContent = [];
    for (const image of images) {
      const file = await openai.files.create({
        file: fs.createReadStream(image.path),
        purpose: "vision",
      });
      imageContent.push({
        type: 'image_file',
        image_file: {
          file_id: file.id,
        },
      });
    }
    return imageContent;
  }

  static async sendMessageToOpenAI(threadId, content) {
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });
  }

  static async deleteFiles(files) {
    const allFiles = [...(files['images'] || []), ...(files['docs'] || [])];
    for (const file of allFiles) {
      try {
        await fs.promises.unlink(file.path);
      } catch (err) {
        console.error(`Error deleting file: ${file.path}`, err);
      }
    }
  }
}

module.exports = messageController