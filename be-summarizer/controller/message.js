const fs = require('fs');
const path = require('path');

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

    const images = req.files;
    
    if (text) {
      text =`"${text}"`
    }

    
    const messageContent = [
      {
        type: 'text',
        text,
      }
    ];

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
      messageContent.shift()
    }

    // const message = await openai.beta.threads.messages.create(
    //   threadId,
    //   {
    //     role: "user",
    //     content: messageContent
    //   }
    // )

    try {
      const message = await openai.beta.threads.messages.create(
        threadId,
        {
          role: "user",
          content: messageContent
        }
      );

      // If the message creation is successful, you can do something with the result here
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
      }
    }
  }
}

module.exports = messageController