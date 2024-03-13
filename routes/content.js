const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
  client : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Client"
  },
  title : String,
  imageLink : String
})

module.exports = mongoose.model('Content',contentSchema);