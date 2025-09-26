const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');

// Create a new book
router.post('/books', orderController.createBook);

// Get all books
router.get('/books', orderController.getAllBooks);

// Create a new order
router.post('/', orderController.createOrder);

// Get all orders
router.get('/', orderController.getAllOrders);

// Cancel an order
router.patch('/:id/cancel', orderController.cancelOrder);

// Add a dispute message to an order
router.post('/:id/dispute', orderController.addDisputeMessage);

// Delete an order
router.delete('/:id', orderController.deleteOrder);


router.get('/:id', orderController.getOrderById);

router.patch('/:id/approve', orderController.approveOrder);
router.patch('/:id/reject', orderController.rejectOrder);
router.patch('/:id/resolve-dispute', orderController.resolveDispute);

router.patch('/:id/complete', orderController.completeOrder);

// Get orders by user ID
router.get('/user/:userid', orderController.getOrdersByUserId);

module.exports = router;