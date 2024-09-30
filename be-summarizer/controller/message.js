const fs = require('fs');
const pdf = require('pdf-parse');

const OpenAI = require("openai");
require("dotenv").config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class messageController {
  static async buildMessageContent(text, docs, req) {
    let messageContent = [];

    if (text) {
      messageContent.push({
        type: 'text',
        text: `"${text}"`,
      });
    }

    if (docs && docs.length > 0) {
      const pdfContent = await messageController.extractPdfContent(docs[0].path);
      messageContent.push({
        type: 'text',
        text: pdfContent,
      });
    }

    // Process images and urls in the exact order they were received
    const imageTypes = Array.isArray(req.body.imageTypes) ? req.body.imageTypes : [req.body.imageTypes];
    const imageFiles = req.files['images'] || [];
    const imageUrls = req.body.urls ? (Array.isArray(req.body.urls) ? req.body.urls : [req.body.urls]) : [];
    
    let fileIndex  = 0;
    let urlIndex = 0;
    
    for (const type of imageTypes) {
      if (type === 'file' && fileIndex < imageFiles.length) {
        const file = await openai.files.create({
          file: fs.createReadStream(imageFiles[fileIndex].path),
          purpose: "vision",
        });
        messageContent.push({
          type: 'image_file',
          image_file: {
            file_id: file.id,
          },
        });
        fileIndex++;
      } else if (type === 'url' && urlIndex < imageUrls.length) {
        messageContent.push({
          type: 'image_url',
          image_url: {
            url: imageUrls[urlIndex],
          },
        });
        urlIndex++;
      }
    }

    return messageContent;
  }

  static async extractPdfContent(filePath) {
    const dataBuffer = await fs.promises.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  static async sendMessageToOpenAI(threadId, content) {
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });
  }

  static async createMessage(req, res) {
    try {
      const { threadId, text } = req.body;

      const docs = req.files['docs'] || [];

      const messageContent = await messageController.buildMessageContent(text, docs, req);

      await messageController.sendMessageToOpenAI(threadId, messageContent);

      res.status(201).json("Message created successfully");
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json("Error creating message");
    } finally {
      await messageController.deleteFiles(req.files);
    }
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