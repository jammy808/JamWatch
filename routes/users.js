const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Could not connect to MongoDB:', error.message);
  });


// mongoose.connect("mongodb://127.0.0.1:27017/pintersetDB");



const adminSchema = mongoose.Schema({

  name : String,
  
  password : String
  
})

adminSchema.plugin(plm);

module.exports = mongoose.model('Admin',adminSchema);
