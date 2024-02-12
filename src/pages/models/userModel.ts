import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  billing: { type: String, required: true },
  country: { type: String, required: true },
  contact: { type: Number, required: true },
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  currentPlan: { type: String, required: true },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Adjusting the model definition to check if it's already compiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
