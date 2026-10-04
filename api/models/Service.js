import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  icon: { type: String, trim: true, default: '' },
  features: { type: [String], default: [] },
  order: { type: Number, default: 0 },
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

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);
