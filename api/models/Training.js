import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  provider: { type: String, required: true, trim: true },
  duration: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  skillsListed: { type: [String], default: [] },
  isCompleted: { type: Boolean, default: false },
  certificateUrl: { type: String, trim: true, default: '' },
  status: { type: String, trim: true, default: 'Actively Relevant' },
  verifiedAt: { type: Date, default: null },
}, {
  timestamps: true,
  strict: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export default mongoose.models.Training || mongoose.model('Training', trainingSchema);
