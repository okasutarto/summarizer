const router = express.Router()
const assistantRouter = require("./assistant")

router.use("/summarize", assistantRouter)

module.exports = router