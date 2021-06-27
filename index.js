const express = require('express')
const path = require('path')
require('./src/db/mongoose')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const bcrypt = require('bcryptjs')
const fileUpload = require('express-fileupload')

const passport = require('passport')
const flash = require('connect-flash')
const expressValidator = require('express-validator')
const session = require('express-session')
const pages = require('./src/routers/page')

// routers
const userRouter = require('./src/routers/user')
const adminPages = require('./src/routers/admin-pages')
const adminCategories =require('./src/routers/admin-categories')
const adminProducts = require('./src/routers/admin-products')
const products = require('./src/routers/products')
const cart = require('./src/routers/cart')

const app = express()
// passport config
require('./config/passport')(passport);
// Express fileUpload middleware
app.use(fileUpload())



app.use(bodyParser.urlencoded({
  extended : true
}))
// parse application/json
app.use(bodyParser.json())

// set global errors variable
app.locals.errors = null
// get Page model
const Page = require('./src/models/page');

// get all pages to pass to header.ejs
Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
  if (err) {
    console.log(err);
  } else {
    app.locals.pages = pages;
  }
});




// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(express.static("public"))
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  // cookie: { secure: true }
}))
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
  
      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    },
  
    customValidators: {
      isImage: function (value, filename) {
        var extension = (path.extname(filename)).toLowerCase();
  
        switch (extension) {
          case '.jpg':
            return '.jpg';
          case '.jpeg':
            return '.jpeg';
          case '.png':
            return '.png';
          case '':
            return '.jpg';
          default:
            return false;
        }
      }
  
    }
  }));
  
  app.use(flash());
  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  })




  
app.use('/users',userRouter)
app.use('/',pages)
app.use('/admin/pages',adminPages)
app.use('/admin/categories',adminCategories)
app.use('/admin/products',adminProducts)
app.use('/products',products)
app.use('/cart',cart)


const port =process.env.PORT || 5000
app.listen(port, ()=>{
    console.log("server started on port 5000")
})