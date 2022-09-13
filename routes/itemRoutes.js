const express = require('express');
const AppError = require('../utils/AppError');
const app = express();
const router = express.Router();
const Item = require('../models/item');
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn } = require('../middleware')
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const MongoStore = require('connect-mongo');
router.use(express.urlencoded({ extended: true }));

// All items page

router.get("/items", catchAsync(async (req, res) => {
    const items = await Item.find({});
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    shuffleArray(items);
    res.render("home", { items });
}));


// Route for item page

router.get("/items/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const item = await Item.findById(id);
    req.session.itemId = id;
    if(!item) {
        throw new AppError('Product Not Found', 404)
    }
    res.render("product", { item });
}));

// Route for brand page

router.get("/brands/:brand", async (req, res) => {
    const { brand } = req.params;
    const uppercase = brand.charAt(0).toUpperCase() + brand.slice(1);
    const items = await Item.find({ brand: uppercase });
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    shuffleArray(items);
    res.render("brand_page", { items });
});

// Route for item line

router.get("/brands/:brand/:slug", async (req, res) => {
    const { slug } = req.params;
    const items = await Item.find({ slug });
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    shuffleArray(items);
    res.render("line_page", { items });
});

router.post('/cart', isLoggedIn, async(req, res) => {
    const { itemId } = req.session
    const { qty, size } = req.body;
    const item = await Item.findById(itemId);
    const price = item.price;
    const img = item.pictures[3];
    const line = item.line;
    const model = item.model;
    const brand = item.brand;
    
    const newCartItem = {
        itemId: itemId,
        qty: qty,
        size: size,
        price: price,
        img: img,
        line: line,
        model: model,
        brand: brand
    };

    // Add item to cart
    const currentCart = req.session.cart;
    let cartIds = [];
    for (let currentCartItem of currentCart) {
        cartIds.push(currentCartItem.itemId);
    }
    if (cartIds.includes(itemId)) {
        req.flash('error', 'Already in the cart.')
    } else {
        req.flash('success', 'Successfully added to cart.')
        req.session.cart.push(newCartItem);
        console.log(req.session.cart);
    }

    // Calculate totals

    req.session.total += price * qty;

    // Number of items

    req.session.number += 1

    req.session.save(err => {
        if(err){
            console.log(err);
            req.flash('error', 'Sorry, something went wrong. :(')
        } else {
            res.redirect('/items');
        }
    });
})

router.get('/checkout', (req, res) => {
    res.render('checkout');
})

router.post('/order', (req, res) => {
    res.render('order_summary')
})

router.get('/new-balance', (req, res) => {
    res.render('new_balance');
})

module.exports = router;
