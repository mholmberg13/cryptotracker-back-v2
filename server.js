const express = require('express');
const app = express();
const PORT = process.env.PORT || 3004;
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');


// controllers
const usersController = require('./controllers/users.js');
const sessionsController = require('./controllers/sessions.js');


// mongoose error / disconnection
mongoose.connection.on('error', err => console.log(err.message + 'is Mongod not running'));
mongoose.connection.on('diconnected', () => console.log('mongo disconnect'));

// mongoose connection
mongoose.connect('mongodb://localhost:27017/cryptowatch', {useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', ()=> {
    console.log('connected to mongoose...');
})

// middleware
app.use(express.json());

// Secret for authentication/session:
app.use(
    session({
      secret: "feedmeseymour", //some random string
      resave: false,
      saveUninitialized: false,
    })
  );

// CORS middleware:
const whitelist = [
    "http://localhost:3000",
    "http://localhost:3005",
    "https://fathomless-sierra-68956.herokuapp.com",
    "https://cryptotrack.herokuapp.com"
  ];
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };
app.use(cors());

// Mount the routes from users controller
app.use('/crypto', usersController)
app.use('/sessions', sessionsController)

// web server
app.listen(PORT, () => {
    console.log('server running on port:',PORT); 
})