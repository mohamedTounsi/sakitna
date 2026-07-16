import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    // Primary front-facing image
    frontImage: { type: String, required: false },
    // Back image shown on hover
    backImage: { type: String, required: false },
    // Additional gallery images shown on product detail page
    galleryImages: { type: [String], default: [] },
    // Legacy field kept for backwards compatibility
    image: { type: String, required: false },
    price1: { type: Number, required: true }, // Price for 1 article
    price2: { type: Number, required: true }, // Price for 2 articles
    price3: { type: Number, required: false, default: 0 }, // Price per extra article for 3+
    originalPrice: { type: Number, required: false }, // Optional cross-out price (e.g. 110)
    isMostWanted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

if (mongoose.models.Product) {
  delete mongoose.models.Product;
}
export default mongoose.model('Product', ProductSchema);
