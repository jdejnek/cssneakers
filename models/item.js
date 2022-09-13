const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const itemSchema = new mongoose.Schema({
    model: String,
    brand: String,
    line: String,
    colorway: String,
    price: Number,
    sizes: [String],
    description: String,
    pictures: [String],
    gender: String,
    slug: {type: String, slug: 'line'}
})

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
