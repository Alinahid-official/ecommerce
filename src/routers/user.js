const express = require('express')
const User = require('../models/user')
const bodyParser =require('body-parser')
const passport =require('passport')
const flash = require('connect-flash')
const expressValidator = require('express-validator')
const bcrypt = require('bcryptjs')



const router = new express.Router()
router.use(bodyParser.urlencoded({
    extended : true
}))
router.get('/signup', function (req, res, next) {

    res.render('signup',{title:'signup'})
  
  })
router.post('/signup',(req,res,next)=>{
    const name =req.body.name
    const email = req.body.email
    const username = req.body.username
    const password =req.body.password
    const password2 = req.body.password2


    req.checkBody('name', 'Name is required!').notEmpty();
    req.checkBody('email', 'Email is required!').isEmail();
    req.checkBody('username', 'Username is required!').notEmpty();
    req.checkBody('password', 'Password is required!').notEmpty();
    req.checkBody('password2', 'Passwords do not match!').equals(password);

    const errors = req.validationErrors()
    if(errors){
        res.render('signup')
        console.log(errors)
    }else{
        User.findOne({username:username},(err,user)=>{
            if(err){
                console.log(err)
            }
            if(user){
                req.flash('danger','username already exist choose another')
            }else{
                    const user = new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password,
                        admin: 0
                    })
                    bcrypt.genSalt(10,(err,salt)=>{
                        bcrypt.hash(user.password,salt, (err,hash)=>{
                            if(err)console.log(err)
                            user.password=hash;

                            user.save((err)=>{
                                if(err){
                                    console.log(err)
                                }else{
                                    req.flash('success','you are now registered')
                                    res.redirect('/users/login')
                                }

                            })
                        })
                    })
            }
        })
    }
})
router.get('/login', function (req, res, next) {

    if (res.locals.user) res.redirect('/')
  
    res.render('login')
  
  })

router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: 'users/login',
      failureFlash: true
    })(req, res, next);
  })

  router.get('/logout', function (req, res, next) {

    req.logout();
  
    req.flash('success', 'You are logged out!');
    res.redirect('/users/login')
  
  
  })

module.exports = router