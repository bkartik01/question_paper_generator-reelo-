if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const Question = require('./models/question');
const questionPaperGeneratorRoute = require('./routes/questionPaperGenerator'); // Import the new route

const app = express();
const port = 3000;

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/beeskpoke.ai';
// Connect to MongoDB
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes
app.use('/', questionPaperGeneratorRoute); // Use the new route

// Display the form
app.get('/', (req, res) => {
  res.render('index');
});
app.get('*' ,(req,res)=>{
  res.status(404).send("route does not exist");
})

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
