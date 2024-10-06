global.express = require('express')
const app = express()
require("dotenv").config()
const port = process.eventNames.PORT || 4000
const router = require("./routes/index")
const cors = require('cors')

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({extended: false}))
  .use("/", router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})