const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/cinekandy';
console.log('Testing MongoDB connection...');
mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
