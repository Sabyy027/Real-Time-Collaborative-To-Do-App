import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
}, { timestamps: true });

const ActionLog = mongoose.model('ActionLog', actionLogSchema);
export default ActionLog;