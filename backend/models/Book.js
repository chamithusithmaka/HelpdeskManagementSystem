const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    bookId: { type: String, unique: true }, // Auto-generated Book ID
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true }, 
    price: { type: Number, required: true },
});

module.exports = mongoose.model(
    "InventoryModel",
    inventorySchema
);