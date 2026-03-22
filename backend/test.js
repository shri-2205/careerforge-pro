const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin12345@cluster0.pdgqobo.mongodb.net/resumeai_vite')
  .then(() => {
    console.log('✅ Connected!');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ Error:', err.message);
    process.exit(1);
  });