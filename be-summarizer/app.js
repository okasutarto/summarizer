global.express = require('express')
const app = express()
require("dotenv").config()
const router = require("./routes/index")
const cors = require('cors')

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({extended: false}))
  .use("/", router)

app.listen(() => {
  console.log("server is running")
})

module.exports = app