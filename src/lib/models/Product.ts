import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Product Info
    name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    discount: Number,
    category: {
      type: String,
      enum: [
        'allopathy',
        'homeopathy',
        'ayurveda',
        'nutrition',
        'personal-care',
        'baby-care',
        'sexual-wellness',
        'fitness',
        'oral-care',
        'hair-care',
        'skin-care',
        'herbal-teas',
        'health-devices',
      ],
      required: true,
    },
    brand: String,
    manufacturer: String,
    stock: {
      type: Number,
      default: 0,
    },
    healthConcerns: [String],
    dosage: String,
    packaging: String,
    expiryDate: Date,
    requiresPrescription: {
      type: Boolean,
      default: false,
    },
    image: String,

    // Vendor Info
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },
    vendorName: {
      type: String,
      default: 'MySanjeevani',
    },
    vendorRating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },

    // Ratings
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
