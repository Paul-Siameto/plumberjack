import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid', 'Shipped', 'Delivered'], default: 'Pending' },
    paymentMethod: { type: String, enum: ['stripe', 'cod', 'mock'], default: 'mock' },
    paymentResult: { type: Object },
    shippingAddress: { type: Object },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);


