const bcrypt = require('bcrypt')
const router = require('express').Router()
const UserModel = require('../models/User')
const passport = require('passport')


const { check, validationResult, body} = require('express-validator')
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








  router.post('/register', [
    check('username', 'This username must be more than 3 characters long')
        .exists()
        .isLength({ min: 3 }),
    check('email', 'Email is not valid')
        .isEmail()
        .normalizeEmail(),
        body('email').custom(value => {
            return UserModel.findOne({email: value}).then(user => {
              if (user) {
                return Promise.reject('E-mail already in use');
              }
            });
          })

],  
check('password', 'Password must be more then 8 charecters long')
.isLength({min: 8})
.matches('^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$')
.withMessage('Password must have at least one lowercase, at least one uppercase, at least one digit'),
body('passwordConfirm').custom((value, { req }) => {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }

  // Indicates the success of this synchronous custom validator
  return true;
})
 ,(req, res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('register', {
            alert
        })
    }
})

// router.post('/register', [
    
//     check('username', 'This username must be more then 3 charecters long')
//     .exists()
//     .isLength({min : 3})

// ],
//  async (req,res)=>{

//     const errors = validationResult(req)
//     if(!errors.isEmpty()){
//         //return res.status(422).jsonp(errors.array())
//         const alert = errors.array()
        
//         res.render('/register', alert)
//     }
//     // try {
//     //     const hashedPassword = await bcrypt.hash(req.body.password, 10)
//     //     const newUser = new UserModel({
//     //         username: req.body.username,
//     //         email: req.body.email,
//     //         password: hashedPassword
//     //     })
//     //     newUser.save().then(newUser => console.log(newUser))
//     //     res.send({succsess : true})
//     // } catch (error) {
//     //     console.log(error)
//     //     res.redirect('/register')
//     // }
// })


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