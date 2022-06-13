const express = require('express')
const cors = require('cors')

const Contact = require('./src/controllers/contacts')
const postgres = require('./src/postgres.js')
const router = require('./src/routers/contact')
const config = require("./config.js")


const PORT = process.env.PORT || 5000
const app = express()
app.use(postgres)
app.use(express.json())
app.use(cors())


app.get("/", (req, res) => res.send("index1.html"));
app.get("/categories/", (req, res) => res.send("categories.html"));



app.use(router)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
   