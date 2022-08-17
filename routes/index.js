const bcrypt = require('bcrypt')
const router = require('express').Router()
const UserModel = require('../models/User')
const passport = require('passport')

router.get('/login' , (req , res)=>{
    res.render('Login')
})

router.get('/register',(req,res)=>{
    res.render('register')
})


router.post('/login', passport.authenticate('local', {
    successRedirect: '/protected',
    failureRedirect: '/login'
  }));

router.post('/register', async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new UserModel({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        newUser.save().then(newUser => console.log(newUser))
        res.send({succsess : true})
    } catch (error) {
        console.log(error)
        res.redirect('/register')
    }
})


router.get('/logout',(req,res)=>{
    res.send('logout get')
})


router.get('/protected', (req, res) => {
    if (req.isAuthenticated()) {
        res.send("Protected")
    } else {
        res.status(401).send({ msg: "Unauthorized" })
    }
    console.log(req.session)
    console.log(req.user)
})



module.exports  = router