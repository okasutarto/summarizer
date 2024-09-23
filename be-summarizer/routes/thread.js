const threadController = require("./../controller/thread")
const threadRouter = express.Router()

threadRouter.post("/create", threadController.createThread)

module.exports = threadRouter