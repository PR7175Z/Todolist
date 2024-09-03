//importing express js for server
const http = require('http');
const express = require("express");
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

http.createServer(function (req, res) {
  const q = url.parse(req.url, true);
  const filename = "." + q.pathname;
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8080);

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'todolist',
  password: 'root',
  port: 5432, // Ensure the port is correct
});

// Function to create the table
function createTable() {
  const sql = `CREATE TABLE todoinfo (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL, 
    date DATE NOT NULL
  )`;
  client.query(sql, (err, res) => {
    if (err) {
      console.error('Error creating table', err.stack);
    } else {
      console.log('Table created');
    }
  });
}

// Function to check if the table exists
function checkTableExists() {
  const checkTableExistsQuery = `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'todoinfo'
    );
  `;

  client.query(checkTableExistsQuery, (err, res) => {
    if (err) {
      console.error('Error checking if table exists', err.stack);
    } else {
      const tableExists = res.rows[0].exists;
      if (!tableExists) {
        createTable();
      } else {
        console.log('Table already exists');
      }
    }
  });
}

client.connect(err => {
  if (err) {
    console.error('Connection error', err.stack);
  } else {
    console.log('Connected to the database');
    checkTableExists();
  }
});

//CORS = cross origin resource sharing
//cors is used in her to prevent CORS issue
const cors = require('cors');

// select some port, if non found use 3001
const PORT = process.env.PORT || 3001;

const app = express();

//using cors function
app.use(cors());

app.use(express.json()); 

const filepath = path.join(__dirname, 'db.json');

//api used for get
app.get("/api", (req, res) => {
  const sql = 'SELECT * FROM todoinfo';
  client.query(sql, (err, result) => {
    if (err) {
      console.error('Error retrieving info', err.stack);
      res.status(500).send('Error retrieving info');
    } else {
      res.json(result.rows);
    }
  });
});

app.post('/api', (req, res) => {
  const { title, date } = req.body;
  const sql = 'INSERT INTO todoinfo (title, date) VALUES ($1, $2)';
  client.query(sql, [title, date], (err, result) => {
    if (err) {
      console.error('Error adding user', err.stack); // Enhanced error logging
      res.status(500).send(`Error adding user: ${err.message}`);
    } else {
      res.status(201).json({ title, date });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});