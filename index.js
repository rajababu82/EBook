const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const mysql = require('mysql2');
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded request bodies
const port=3000;
// Create a connection pool



app.use(express.static(__dirname));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'user1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/', async(req, res) => {
  res.sendFile(__dirname + '/index.html');
  });

  app.post('/register', (req, res) => {
    const { name, email, phoneNo, password } = req.body;
  
    // Create a new user object
    const user = {
      name,
      email,
      phoneNo,
      password
    };
  
    // Insert the user data into the database
    pool.query('INSERT INTO users SET ?', user, (error, results) => {
      if (error) {
        console.error('Error inserting data:', error);
        res.sendStatus(500);
        
      }
      res.sendFile(__dirname + '/login.html');
    });
  });
  
app.post('/login',(req,res)=>{
  const email = req.body.email;
  const password = req.body.password.trim();
  // Check user credentials in the database
  pool.query(`SELECT * FROM users WHERE email='${email}' AND password='${password}'`, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Internal Server Error');
    }

    // Check if a user with matching credentials exists
    if (results.length === 0) {
      return res.status(401).send('Invalid email or password');
    }
  res.sendFile(__dirname + '/user.html');
})
});

app.get('/login',(req,res)=>{
  res.sendFile(__dirname + '/login.html');
})

app.get('/recentbook',(req,res)=>{
  res.sendFile(__dirname + '/all_recent_book.html');
})

app.get('/newbook',(req,res)=>{
  res.sendFile(__dirname + '/all_new_book.html');
})
app.get('/oldbook',(req,res)=>{
  res.sendFile(__dirname + '/all_old_book.html');
})
app.get('/logout',(req,res)=>{
  res.sendFile(__dirname + '/index.html');
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



 