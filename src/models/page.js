const mongoose = require('mongoose');

// page schema
const PageSchema = mongoose.Schema({

  title: {
    type: String,
    require: true
  },
  slug: {
    type: String
  },
  content: {
    type: String,
    require: true
  },
  sorting: {
    type: Number
  },

});

const Page = mongoose.model("Page", PageSchema);

module.exports = Page;
