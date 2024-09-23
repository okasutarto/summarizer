const messageController = require("./../controller/message")
const messageRouter = express.Router()

messageRouter.post("/create", messageController.createMessage)

module.exports = messageRouter