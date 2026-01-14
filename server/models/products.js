const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    price: { type: String, required: true },
    quantity: { type: Number, required: true },
    isSold: { type: Boolean, default: false },
    seller: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);