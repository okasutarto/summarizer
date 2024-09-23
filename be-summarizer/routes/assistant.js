const assistantController = require("./../controller/assistant")
const assistantRouter = express.Router()

assistantRouter.post("/create", assistantController.createAssistant)

assistantRouter.delete("/delete", assistantController.deleteAssistant)

module.exports = assistantRouter