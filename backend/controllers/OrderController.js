const Order = require('../models/Order');
const Book = require('../models/Book');

// Create a new order and reduce book quantities
exports.createOrder = async (req, res) => {
  try {
    const { items, userid, username, cardNumber, cvv, expiry } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items required.' });
    }

    // Validate and update inventory
    let totalItems = 0;
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res.status(404).json({ success: false, message: `Book not found: ${item.bookId}` });
      }
      if (book.quantity < item.quantity) {
        return res.status(400).json({ success: false, message: `Not enough quantity for ${book.itemName}` });
      }
      // Reduce book quantity
      book.quantity -= item.quantity;
      await book.save();

      orderItems.push({
        bookId: book.bookId, // <-- Change this line
        itemName: book.itemName,
        price: book.price,
        quantity: item.quantity
      });
      totalItems += item.quantity;
      totalPrice += book.price * item.quantity;
    }

    // Get the latest order number
    const lastOrder = await Order.findOne().sort({ createdAt: -1 });
    let nextOrderNumber = 1;
    if (lastOrder && lastOrder.orderId) {
      const lastNum = parseInt(lastOrder.orderId.replace('ORD-', ''));
      if (!isNaN(lastNum)) nextOrderNumber = lastNum + 1;
    }
    const orderId = `ORD-${nextOrderNumber}`;

    // Create order
    const order = await Order.create({
      orderId,
      items: orderItems,
      totalItems,
      totalPrice,
      userid,
      username,
      cardNumber,
      cvv,
      expiry
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { itemName, quantity, price } = req.body;

    // Find last book for increment
    const lastBook = await Book.findOne().sort({ createdAt: -1 });
    let nextBookNumber = 1000;
    if (lastBook && lastBook.bookId) {
      const lastNum = parseInt(lastBook.bookId.replace('BK-', ''));
      if (!isNaN(lastNum)) nextBookNumber = lastNum + 1;
    }
    const bookId = `BK-${nextBookNumber}`;

    const newBook = await Book.create({
      bookId,
      itemName,
      quantity,
      price
    });

    res.status(201).json({ success: true, data: newBook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve order
exports.approveOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.status !== 'Pending') return res.status(400).json({ success: false, message: 'Only pending orders can be approved' });
    order.status = 'Approved';
    order.approval = {
      approvedBy: req.body.approvedBy || 'Admin',
      approvedAt: new Date()
    };
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject order
exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.status !== 'Pending') return res.status(400).json({ success: false, message: 'Only pending orders can be rejected' });
    order.status = 'Rejected';
    order.approval = {
      approvedBy: req.body.approvedBy || 'Admin',
      approvedAt: new Date(),
      rejectedReason: req.body.rejectedReason || ''
    };
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Resolve dispute
exports.resolveDispute = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || !order.dispute) return res.status(404).json({ success: false, message: 'Order or dispute not found' });
    order.dispute.status = 'Resolved';
    order.dispute.resolution = req.body.resolution || '';
    await order.save();
    res.status(200).json({ success: true, data: order.dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark order as completed
exports.completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.status !== 'Approved') return res.status(400).json({ success: false, message: 'Only approved orders can be completed' });
    order.status = 'Completed';
    await order.save();
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (order.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled' });
    }
    order.status = 'Cancelled';
    await order.save();
    res.status(200).json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a dispute message to an order
exports.addDisputeMessage = async (req, res) => {
  try {
    const { message, sender } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (!message || !sender) {
      return res.status(400).json({ success: false, message: 'Message and sender required' });
    }
    if (!order.dispute) {
      order.dispute = { status: 'Open', messages: [], resolution: '' };
    }
    order.dispute.messages.push({ sender, message, sentAt: new Date() });
    await order.save();
    res.status(200).json({ success: true, data: order.dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    if (
      order.status !== 'Rejected' &&
      order.status !== 'Cancelled' &&
      order.status !== 'Completed'
    ) {
      return res.status(403).json({ success: false, message: 'Only completed, rejected or cancelled orders can be deleted' });
    }
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get orders by user ID
exports.getOrdersByUserId = async (req, res) => {
  try {
    const { userid } = req.params;
    const orders = await Order.find({ userid }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};