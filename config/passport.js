const localStrategy = require('passport-local').Strategy
const User = require('../src/models/user')
const bcrypt = require('bcryptjs')


module.exports = function(passport){
    passport.use(new localStrategy(
        function(username,password,done){
            
            User.findOne({username:username},function(err,user){
                if(err) return done(err)
                if(!user) return done(null,false, {message: 'no user found'})
                bcrypt.compare(password,user.password,function(err,isMatch){
                    if(err) return done(null,false)
                    if(isMatch){
                        return done(null,user)
                    }else{
                        return done(null,false,{message:'wrong password'})
                    }
                })
            })
        }
    ))

passport.serializeUser(function(user,done){
    done(null,user.id)
})
passport.deserializeUser(function(id,done){
    User.findById(id, function(err,user){
        done(err,user)
    })
})
}