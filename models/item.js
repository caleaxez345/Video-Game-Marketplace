const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema ({
    title: {type: String, required: [true, 'Title is required']},
    seller: {type: Schema.Types.ObjectId, ref:'User', required: [true, 'Seller is required']},
    condition: {type: String, enum: ['New', 'Like New', 'Very Good', 'Good', 'Other'], required: [true, 'Condition is required']},
    price: {type: Number, min: 0.01, required: [true, 'Price is required']},
    details: {type: String, required: [true, 'Details is required']},
    image: {type: String, required: [true, 'Image is required']},
    totalOffers: {type: Number, default: 0},
    active: {type: Boolean, default: true},
    highestOffer: {type: Number, default: 0}
});

module.exports = mongoose.model('Item', itemSchema);