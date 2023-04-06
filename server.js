// Setup empty JS object to act as endpoint for all routes
projectData = {}

let journals = []

// Require Express to run server and routes
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
// Start up an instance of app
const app = express()
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// Cors for cross origin allowance

// Initialize the main project folder
app.use(express.static("website"))

app.post("/journals", (req, res) => {
  const journal = req.body
  journal.created_at = new Date().toISOString()
  journals.push(journal)
  return res.status(200).json({ message: "Journal created", journal })
})

// Setup Server
const PORT = 3000
app.listen(PORT, () => {
  console.log("listening on localhost:", PORT)
})
