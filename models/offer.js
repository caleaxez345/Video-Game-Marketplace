const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({ 
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    item: {type: Schema.Types.ObjectId, ref: 'Item', required: true},
    amount: {type: Number, required: [true, 'Offer amount is required'], min: 0.01},
    status: {type: String, enum: ['pending', 'rejected', 'accepted'], default: 'pending'}
});

module.exports = mongoose.model('Offer', offerSchema);