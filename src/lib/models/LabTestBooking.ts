import mongoose from 'mongoose';

const labTestBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LabTest',
      required: true,
    },
    testName: String,
    testPrice: Number,
    collectionType: {
      type: String,
      enum: ['home', 'center'],
      default: 'home',
    },
    collectionDate: Date,
    collectionTime: String,
    address: String,
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    reportUrl: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

export const LabTestBooking =
  mongoose.models.LabTestBooking ||
  mongoose.model('LabTestBooking', labTestBookingSchema);
