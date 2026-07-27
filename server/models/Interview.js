import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  role: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  questions: [{
    category: { type: String, required: true },
    question: { type: String, required: true }
  }],
  transcript: [{
    sender: { type: String, required: true }, // 'AI' or 'Candidate'
    text: { type: String, required: true }
  }],
  score: {
    type: Number,
    default: 0
  },
  evalDetails: {
    technicalAccuracy: { type: Number, default: 0 },
    communicationClarity: { type: Number, default: 0 },
    starCompliance: { type: Number, default: 0 },
    actionItems: { type: [String], default: [] }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
