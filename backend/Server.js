const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const Sequelize = require('sequelize');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json());
app.use(cookieParser());

// MySQL connection
const sequelize = new Sequelize('railway_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});


sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

// Models
const User = sequelize.define('user', {
  username: { type: Sequelize.STRING, unique: true },
  password: { type: Sequelize.STRING },
  role: { type: Sequelize.STRING }
});

const Train = sequelize.define('train', {
  train_id: { type: Sequelize.STRING, unique: true },
  train_name: { type: Sequelize.STRING },
  source: { type: Sequelize.STRING },
  destination: { type: Sequelize.STRING },
  total_seats: { type: Sequelize.INTEGER },
  available_seats: { type: Sequelize.INTEGER }
});

const Booking = sequelize.define('booking', {
  booking_id: { type: Sequelize.STRING, unique: true },
  train_id: { type: Sequelize.STRING },
  user_id: { type: Sequelize.STRING }
});


sequelize.sync()
  .then(() => console.log('Database & tables created!'))
  .catch(err => console.log('Error: ' + err));

// JWT Secret Key
const secret = 'your_secret_key';



const generateToken = (user) => {
    try {
      const token = jwt.sign(user, secret, { expiresIn: '1h' });
    //   console.log("In generateToken");
    //   console.log(token);
      return token;
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Token generation failed');
    }
  };



const authenticateToken = (req, res, next) => {
    const token = req.body.jwtToken;
    //console.log(token)
    if (!token){
        alert("Please Login to proceed...")
        return res.sendStatus(401);
    }
    try {
      req.user = jwt.decode(token, secret);
      next();
    } catch (e) {
      res.sendStatus(401);
    }
  };
  

// Endpoints

// Register a user
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    await User.create({ username, password, role });
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("In Login")
    try {
      const user = await User.findOne({ where: { username, password } });
    //   console.log(user);
      if (user != null) {
        const token = await generateToken({ username: user.username, role: user.role });
        //console.log("In Login")
        //console.log(token)
        res.cookie('authToken', token, { maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
                                            // httpOnly: true,
                                            // sameSite: "strict",
                                            // secure: process.env.NODE_ENV !== "development", 
                                            }); // Set cookie
        res.json({ message: 'Login successful', token });
      } else {
        console.log("Else block")
        res.sendStatus(401);
      }
    } catch (error) {
        console.log(error)
      res.status(400).json({ message: error.message });
    }
  });
  

// Add a new train (Admin only)
app.post('/api/trains', authenticateToken, async (req, res) => {
  const { train_id, train_name, source, destination, total_seats } = req.body;
  if (req.user.role === 'admin') {
    try {
      await Train.create({ train_id, train_name, source, destination, total_seats, available_seats: total_seats });
      res.json({ message: 'Train added successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.sendStatus(403);
  }
});

// Get seat availability
app.get('/api/trains/availability', async (req, res) => {
  const { source, destination } = req.query;
  try {
    const result = await Train.findAll({ where: { source, destination } });
    res.json({ trains: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Book a seat
app.post('/api/bookings', authenticateToken, async (req, res) => {
  const { train_id } = req.body;
  try {
    const train = await Train.findOne({ where: { train_id } });
    if (train && train.available_seats > 0) {
      train.available_seats--;
      await train.save();
      const booking_id = `booking_${Math.random().toString(36).substr(2, 9)}`;
      await Booking.create({ booking_id, train_id, user_id: req.user.username });
      res.json({ message: 'Booking successful', booking_id });
    } else {
      res.status(400).json({ message: 'No seats available' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get specific booking details
app.get('/api/bookings/:booking_id', authenticateToken, async (req, res) => {
  const { booking_id } = req.params;
  try {
    const booking = await Booking.findOne({ where: { booking_id } });
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
