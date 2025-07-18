import mongoose from 'mongoose';


const imageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

const listingSchema = new mongoose.Schema({
  category: String,
  title: String,
  brand: String,
  model: String,
  condition: String,
  authenticity: String,
  description: String,
  features: String,
  price: String,
  city: String,
  area: String,
  fullName: String,
  showPhoneNumber: Boolean,
  isDeleted:{
    type:Boolean,
    default:false
  },
  images: [imageSchema],
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming your user model name is "User"
    required: true
  }
}, { timestamps: true });


const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
