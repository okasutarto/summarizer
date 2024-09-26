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
    
    // Alternatively, if you want to ensure uniqueness:
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

messageRouter.post("/create",upload.array('images'), messageController.createMessage)

module.exports = messageRouter