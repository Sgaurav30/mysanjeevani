import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    startTime: { type: String, required: true }, // e.g. "09:00"
    endTime: { type: String, required: true },   // e.g. "13:00"
    maxPatients: { type: Number, default: 20 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: '' },
    department: {
      type: String,
      required: true,
      enum: [
        'General Medicine',
        'Cardiology',
        'Dermatology',
        'Pediatrics',
        'Orthopedics',
        'Neurology',
        'Gynecology',
        'ENT',
        'Ophthalmology',
        'Psychiatry',
        'Oncology',
        'Urology',
        'Gastroenterology',
        'Endocrinology',
        'Pulmonology',
      ],
    },
    specialization: { type: String, required: true },
    experience: { type: Number, default: 0 }, // years
    qualification: { type: String, default: '' },
    bio: { type: String, default: '' },
    consultationFee: { type: Number, required: true },
    timeSlots: [timeSlotSchema],
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    avatar: { type: String, default: '' }, // emoji or URL
  },
  { timestamps: true }
);

export const Doctor =
  mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
