import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  icon: { type: String, trim: true, default: '' },
  category: { type: String, trim: true, default: '' },
  importance: { type: Number, default: 1 },
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

export default mongoose.models.Skill || mongoose.model('Skill', skillSchema);
