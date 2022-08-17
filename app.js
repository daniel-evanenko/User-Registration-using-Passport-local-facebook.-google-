const express = require('express');
const session = require('express-session')
const mongoose = require('mongoose')
const path = require('path')
const dotenv = require('dotenv');
const connectDB = require('./server/database/connection');
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')
const passport = require('passport')

const app = express();

// load config
dotenv.config({path: './config/config.env'})

const PORT = process.env.PORT || 8080

// load passpord
require('./config/passport')



app.use(bodyParser.urlencoded({
    extended: true
  }))

//mongoDB connection
connectDB()


// Handlebars
app.set('view engine', '.ejs');

// Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
    cookie :{
          //msec   sec   min    hour   
      maxAge: 1000  *60   *60   *24
    }
  }))

app.use(passport.initialize())
app.use(passport.session())


// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))


// app.get('/auth/facebook',
//   passport.authenticate('facebook'));

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

app.listen(PORT, ()=> { console.log(`on port: http://localhost:${PORT}`)});
