const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const UserModel = require('../models/User')
const GoogleUserModel = require('../models/GoogleUser.js')
const FacebookUserModel = require('../models/FacebookUser')
const bcrypt = require('bcrypt')
const passport = require('passport')

// passport-local strategy \\
passport.use(new LocalStrategy(
  (username, password, done) => {
    UserModel.findOne({
      username: username
    }, (err, user) => {
      if (err) { // when some error occurs
        return done(err);
      }
      if (!user) { // when username is incorrect
        return done(null, false, {
          message: 'Incorrect Username'
        })
      }
      if (!bcrypt.compare(password, user.password)) { // when password is incorrect
        return done(null, false), {
          message: 'Incorrect Password'
        }
      }
      return done(null, user) // when user is valid
    });
  }
));

// Google Auth //
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async(accsessToken, refreshToken, profile, done)=>
{
  // userSchema that match google
  const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      Image: profile.photos[0].value
  }

  try {
      // find user with the same google id in the database
      let user = await GoogleUserModel.findOne({googleId: profile.id})
      if(user){
          done(null,user)
      }else{
          user = await GoogleUserModel.create(newUser) // if google id not found then create new user.
          done(null, user)
      }
  } catch (err) {
      console.error(err)
  }
}))
// // Persists user data inside session
// passport.serializeUser((user, done) => {
//   done(null, user.id)
// })
// // Fetches session details using session id
// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => done(err, user) )
// })

// passport-facebook strategy \\ 
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  async(accsessToken, refreshToken, profile, done)=>
  {
    // userSchema that match google
    const newUser = {
        facebookId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        gender: profile.gender,
    }
  
    try {
        // find user with the same google id in the database
        let user = await FacebookUserModel.findOne({facebookId: profile.id})
        if(user){
            done(null,user)
        }else{
            user = await FacebookUserModel.create(newUser) // if google id not found then create new user.
            done(null, user)
        }
    } catch (err) {
        console.error(err)
    }
  }
));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});