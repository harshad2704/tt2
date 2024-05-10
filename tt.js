// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));


// User Model
const User = require('./models/User');

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, age } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const newUser = new User({ username, password, email, age });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update endpoint
app.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, email, age } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { username, password, email, age }, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete endpoint
app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server started on port ${PORT}));







// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // Ensure username is unique
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure email is unique
  },
  age: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);




// npm install express mongoose body-parser


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const User = mongoose.model('User', {
  username: String,
  password: String,
  email: String,
  age: Number
});

app.post('/register', async (req, res) => {
  const { username, password, email, age } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    return res.status(400).json({ message: 'User already registered' });
  }

  const newUser = new User({ username, password, email, age });
  await newUser.save();
  
  res.status(201).json({ message: 'User registered successfully', user: newUser });
});



app.post('/login', async (req, res) => {
  const { username, password } = req.body;


  const user = await User.findOne({ username, password });

  if (user) {
    res.json({ message: 'Login successful' });
  } 
  else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});



app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, email, age } = req.body;

  const updatedUser = await User.findByIdAndUpdate(id, { username, password, email, age }, { new: true });

  res.json(updatedUser);
});

app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.json({ message: 'User deleted successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
