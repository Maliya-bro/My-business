const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // OAuth වලදී Password නැත
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  googleId: { type: String },
  githubId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);