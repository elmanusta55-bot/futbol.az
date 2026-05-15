import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    subscription: {
      tier: {
        type: String,
        enum: ['free', 'pro', 'elite'],
        default: 'free',
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      active: { type: Boolean, default: false },
      renewalDate: Date,
    },
    fantasyStats: {
      totalTournaments: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      totalWinnings: { type: Number, default: 0 },
      bestRanking: { type: Number, default: null },
    },
    favoriteTeam: String,
    settings: {
      notifications: { type: Boolean, default: true },
      soundEnabled: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// Parol şifrələmə
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Parol doğrulama metodu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
