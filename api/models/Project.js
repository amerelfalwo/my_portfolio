import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  tags: { type: [String], default: [] },
  repoUrl: { type: String, trim: true, default: '' },
  liveUrl: { type: String, trim: true, default: '' },
  imageUrl: { type: String, trim: true, default: '' },
  category: { type: String, trim: true, default: '' },
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

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
