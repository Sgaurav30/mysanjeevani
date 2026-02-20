import mongoose from 'mongoose';

const doctorConsultationSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorName: String,
    specialization: String,
    consultationType: {
      type: String,
      enum: ['video', 'audio', 'chat'],
      default: 'video',
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'in-progress'],
      default: 'scheduled',
    },
    startTime: Date,
    endTime: Date,
    duration: Number, // in minutes
    fees: Number,
    notes: String,
    prescription: String,
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    feedback: String,
  },
  {
    timestamps: true,
  }
);

export const DoctorConsultation =
  mongoose.models.DoctorConsultation ||
  mongoose.model('DoctorConsultation', doctorConsultationSchema);
