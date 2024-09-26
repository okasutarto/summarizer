const fs = require('fs');
const pdf = require('pdf-parse');

const OpenAI = require("openai")
require("dotenv").config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class messageController {
  static async createMessage (req, res) {
    let {
      threadId,
      text
    } = req.body
    
    const images = req.files['images'] || [];
    const docs = req.files['docs'] || [];
    
    if (text) {
      text =`"${text}"`
    }

    const messageContent = [
      {
        type: 'text',
        text,
      }
    ];

    if (docs && docs.length > 0) {
      let pdfContent = ''
      let dataBuffer = fs.readFileSync(docs[0].path);
      await pdf(dataBuffer).then(function(data) {
        pdfContent = data.text
      });
      messageContent[0].text = pdfContent
    }

    if (images && images.length > 0) {
      for (const image of images) {
        const file = await openai.files.create({
          file: fs.createReadStream(image.path),
          purpose: "vision",
        })
        messageContent.push({
          type: 'image_file',
          image_file: {
            file_id: file.id,
          },
        });
      }
      messageContent[0].text = "Summary what's on the images"
    }

    try {
      const message = await openai.beta.threads.messages.create(
        threadId,
        {
          role: "user",
          content: messageContent
        }
      );

      res.status(201).json("Message created successfully");
      deleteImages()
    } catch (error) {
      // If an error occurs during the API call, it will be caught here
      console.error("Error creating message:", error);
      deleteImages()
    }

    function deleteImages () {
      if (images && images.length > 0) {
        for (const image of images) {
          try {
            fs.unlinkSync(image.path);
          } catch (err) {
            console.error(`Error deleting file: ${image.path}`, err);
            // Handle the error, such as logging or reporting it
          }
        }
      } else if (docs && docs.length > 0) {
        for (const doc of docs) {
          try {
            fs.unlinkSync(doc.path);
          } catch (err) {
            console.error(`Error deleting file: ${doc.path}`, err);
            // Handle the error, such as logging or reporting it
          }
        }
      }
    }
  }
}

module.exports = messageController