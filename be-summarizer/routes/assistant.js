const assistantController = require("./../controller/assistant")
const assistantRouter = express.Router()

assistantRouter.post("/", assistantController.assistant)

module.exports = assistantRouter