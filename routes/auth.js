const passport = require('passport')
const router = require('express').Router()

// @desc    Auth with Google
// @route   GET /auth/google

router.get('/google' , passport.authenticate('google', {scope: ['profile'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback' , passport.authenticate('google',{ failureRedirect: '/login', successRedirect: '/protected'}))

// @desc    Auth with Facebook
// @route   GET /auth/facebook
router.get('/facebook',passport.authenticate('facebook'));

// @desc    Facebook auth callback
// @route   GET /auth/facebook/callback  
router.get('/facebook/callback',passport.authenticate('facebook',{ failureRedirect: '/login', successRedirect: '/protected'}))


// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res, next) => {
    req.logout((err)=> {
      if(err){ 
        return next(err)
    }
      res.redirect('/')
    })
  })
module.exports  = router