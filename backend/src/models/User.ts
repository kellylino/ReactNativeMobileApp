import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, validate: [validator.isEmail, 'invalid email address'] },
    password: { type: String, required: true },
    username: { type: String, required: true, minlength: 3, maxlength: 50 },
    profile_img: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);