const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const User = require('../models/user');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const methodOverride = require('method-override');
const sanitizeHtml = require('sanitize-html');
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride('_method'));
router.use(passport.initialize());
router.use(passport.session());

//User registration

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.post('/signup', catchAsync(async (req, res, next) => {
    const { firstName, lastName, username, password, email, streetAddress, country, city, zip, company } = req.body;
    sanitizeHtml(req.body);
    const user = new User({ firstName, lastName, username, email, streetAddress, country, city, zip, company });
    const newUser = await User.register(user, password);
    req.login(newUser, err => {
        if (err) return next(err);
        req.flash('success', `Welcome to CSSNeakers, ${newUser.firstName}!`)
        res.redirect('/items');
    });
    console.log(newUser);
}));

//Login

router.get("/login", (req, res) => {
    res.render("login");
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
    const name = req.user.firstName;
    req.flash('success', `Welcome back, ${name}!`)
    res.redirect('/items') 
})

// Account page

router.get('/account', isLoggedIn, (req, res) => {
    res.render('account')
})

router.get('/account_info', isLoggedIn, (req, res) => {
    res.render('account_info')
})

// Update user data

router.patch('/account_info', isLoggedIn, catchAsync(async(req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id, {...req.body});
    sanitizeHtml(req.body);
    req.flash('success', 'Your account has been updated.');
    res.redirect('/account');
}));


// Logout

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(function (err) {
        req.flash('success', `See ya!`)
        res.redirect('/items')
    });
})

module.exports = router;