const summarizeController = require("./../controller/summarize")
const summarizeRouter = express.Router()

summarizeRouter.get("/create/:threadId", summarizeController.createSummary)

module.exports = summarizeRouter