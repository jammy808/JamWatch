const mongoose = require('mongoose');

const carouselSchema = mongoose.Schema({
  
  title : String,
  imageLink : String,
  plot : String,
  type : String,
  year : String,
  time : String
})

module.exports = mongoose.model('Carousel',carouselSchema);