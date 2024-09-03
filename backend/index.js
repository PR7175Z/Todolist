//importing express js for server
const express = require("express");
const fs = require('fs');
const path = require('path');

//CORS = cross origin resource sharing
//cors is used in her to prevent CORS issue
const cors = require('cors');

// select some port, if non found use 3001
const PORT = process.env.PORT || 3001;

const app = express();

//using cors function
app.use(cors());

app.use(express.json()); 

//api used for get
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.post('/api', (req, res) => {
  const title = req.body.title

  // Define the file path to write the data
  const filepath = path.join(__dirname, 'db.json');

  // Write data to the file
  fs.writeFile(filepath, JSON.stringify({ title }), 'utf8', (err) => {
    if (err) {
      return res.status(500).send('Error writing to file');
    }
    res.json({ message: 'File written successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});