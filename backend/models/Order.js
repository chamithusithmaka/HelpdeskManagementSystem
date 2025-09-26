const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const disputeMessageSchema = new Schema({
  sender: { type: String, required: true }, // user or manager
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now }
});

const disputeSchema = new Schema({
  status: { type: String, enum: ['Open', 'Resolved', 'Rejected'], default: 'Open' },
  messages: [disputeMessageSchema], // conversation thread
  resolution: { type: String }
});

const orderItemSchema = new Schema({
  bookId: { type: String, required: true },
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new Schema({
  orderId: { type: String, unique: true }, // <-- Add this line
  items: [orderItemSchema],
  totalItems: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed'], 
    default: 'Pending' 
  },
  userid: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  approval: {
    approvedBy: { type: String },
    approvedAt: { type: Date },
    rejectedReason: { type: String }
  },
  dispute: disputeSchema
});

module.exports = mongoose.model('Order', orderSchema);