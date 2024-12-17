import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  phoneNo: { type: String, match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"], required: true },
});

const paymentSchema = new mongoose.Schema({
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'PayPal', 'UPI', 'Net Banking', 'Stripe'],
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  paymentDate: Date,
  transactionId: String, // Stores the transaction ID if applicable
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurant: [{
    restaurantid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Confirmed',
    }
  }],
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu', // Reference to Menu model
      required: true,
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  shippingDetails: {
    type: shippingSchema,
    required: true,
  },
  paymentDetails: {
    type: paymentSchema,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Delivered'],
    default: 'Pending',
  },
  orderTotal: {
    type: Number,
    required: true,
  },
  deliveryTime: {
    type:  Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// This method could calculate the total based on items
orderSchema.methods.calculateTotal = function () {
  this.orderTotal = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  return this.orderTotal;
};

// Export the model
export const Order = mongoose.model('Order', orderSchema);
