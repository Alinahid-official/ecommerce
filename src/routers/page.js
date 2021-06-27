const express = require('express');
const passport = require('passport')
const router = express.Router();

var Product = require('../models/product');

// get Category model
var Category = require('../models/category');

/*
 * GET / 
*/
router.get('/', function (req, res, next) {

  
      Category.find({}, function (err, categories) {
            Product.find({}, function (err, products) {
              if (err)
                console.log(err);
        
              res.render('index', {
                title: 'Home',
                products: products,
                categories: categories,
                user : req.user
              });
            });
          })
      
})
// router.get('/:slug', function (req, res, next) {

//       var slug = req.params.slug;
    
//       Page.findOne({ slug: slug }, function (err, page) {
//         if (err)
//           console.log(err);
    
//         if (!page) {
//           res.redirect('/');
//         } else {
//           res.render('index', {
//             title: page.title,
//             content: page.content,
//             slug: page.slug
//           });
//         }
//       });
//     });

module.exports = router