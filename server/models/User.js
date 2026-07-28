import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
    // We validate plain text complexity criteria in the controllers
    // before hashing, as mongoose validation on this field runs post-hash.
  },
  credits: {
    type: Number,
    default: 8
  },
  targetJobTitle: {
    type: String,
    trim: true,
    default: ''
  },
  experienceLevel: {
    type: String,
    enum: {
      values: ['entry', 'mid', 'senior', 'lead', ''],
      message: '{VALUE} is not a valid experience level'
    },
    default: ''
  },
  refreshTokens: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
export default User;
