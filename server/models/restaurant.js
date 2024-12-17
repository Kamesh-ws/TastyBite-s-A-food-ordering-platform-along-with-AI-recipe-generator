import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address: { type: String },
  city: { type: String },
  state: { type: String },
});

const restaurantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  phoneNo: {
    type: String,
  },
  address: addressSchema,
  deliveryPrice: {
    type: Number,
    require: true
  },
  estimatedDeliveryTime: {
    type: Number,
    require: true
  },
  cuisines: [{
    type: String,
    enum: ['Biryani', 'Pizza', 'South-Indian', 'Burgers', 'Chinese', 'Cakes', 'Shake', 'North-Indian', 'Ice-Cream', 'Pasta', 'Noodles', 'Rolls', 'Salad', 'Sandwich', 'Deserts'],
    require: true
  }],
  rating: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: true
  },
  menu: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',  // Reference to MenuItem model
  }],
  specialMenu: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SpecialDish',  // Reference to MenuItem model
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',  // Reference to Order model
  }],
}, { timestamps: true });

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
