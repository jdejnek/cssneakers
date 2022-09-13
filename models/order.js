const mongoose = require('mongoose');
const Item = require('./item');
const user = require('./user');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    date: Date,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Item',
    }]
})

module.exports = mongoose.model('Order', orderSchema);