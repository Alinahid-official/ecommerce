var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
// var auth = require('../config/auth'); -- for access control --
// var isUser = auth.isUser;

// get Product model
var Product = require('../models/product');

// get Category model
var Category = require('../models/category');

/*
 * GET all products 
*/
router.get('/', function (req, res, next) {
  // router.get('/', isUser, function (req, res, next) {  -- for access control --

  Category.find({}, function (err, categories) {
    Product.find({}, function (err, products) {
      if (err)
        console.log(err);

      res.render('product_list', {
        title: 'All products',
        products: products,
        categories: categories,
        user : req.user
      });
    });
  })

});


/*
* GET products by category
*/
router.get('/:category', function (req, res, next) {
  Category.find({}, function (err, categories){

  var categorySlug = req.params.category;

  Category.findOne({ slug: categorySlug }, function (err, c) {
    Product.find({ category: categorySlug }, function (err, products) {
      if (err)
        console.log(err);

      res.render('category_products', {
        title: c.title,
        products: products,
        categories : categories,
        user : req.user
      });
    });
  });
})

});


/*
* GET products details
*/
router.get('/:category/:product', function (req, res, next) {

  var galleryImages = null;
  var loggedIn = (req.isAuthenticated()) ? true : false;

  Product.findOne({ slug: req.params.product }, function (err, product) {
    if (err) {
      console.log(err);
    } else {
      var galleryDir = 'public/product-images/' + product._id + '/gallery';
      fs.readdir(galleryDir, function (err, files) {
        if (err) {
          console.log(err);
        } else {
          galleryImages = files;
          Category.find({}, function(err,categories){
            res.render('product-details', {
              title: product.title,
              p: product,
              galleryImages: galleryImages,
              loggedIn: loggedIn,
              categories: categories,
              user : req.user
            });
          })

          
        }
      });

    }
  });

});
module.exports = router;