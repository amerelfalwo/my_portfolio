import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  issuer: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  imageUrl: { type: String, trim: true, default: '' },
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

export default mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);
