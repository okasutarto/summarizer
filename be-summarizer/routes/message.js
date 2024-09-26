const messageController = require("./../controller/message")
const messageRouter = express.Router()

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    // Keep the original filename
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

messageRouter.post("/create",upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'docs', maxCount: 1 }
]), messageController.createMessage)

module.exports = messageRouter