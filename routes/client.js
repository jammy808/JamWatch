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

const clientSchema = mongoose.Schema({

  name : String, 
  password : String,
  content : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Content"
  }]
  
})

clientSchema.plugin(plm);

module.exports = mongoose.model('Client',clientSchema);
