const router = express.Router()
const assistantRouter = require("./assistant")
const summarizeRouter = require("./summarize")
const threadRouter = require("./thread")
const messageRouter = require("./message")

router.use("/assistant", assistantRouter)

router.use("/summary", summarizeRouter)

router.use("/thread", threadRouter)

router.use("/message", messageRouter)

module.exports = router