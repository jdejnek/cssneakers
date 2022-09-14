require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const sanitizeHtml = require('sanitize-html');
mongoose.plugin(slug);
app.use(morgan('dev'));
const dbUrl = process.env.DB_URL

// Require mongo models

const User = require("./models/user");
const Item = require("./models/item");

// Session config

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: process.env.SECRET,
    collection: 'sessions',
    touchAfter: 24 * 60 * 60
});

store.on('error', function(e) {
    console.log('SESSION STORE ERROR', e)
});

const sessionConfig = {
    store: store,
    secret: process.env.SECRET,
    name: 'session_id',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig));
app.use(flash());


// Mongo config

//"mongodb://localhost:27017/sneakerInventory"



main(console.log("Mongo connected")).catch((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}



// View engine

app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(mongoSanitize());


// Passport config

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.req = req;
    res.locals.loggedUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.session = req.session;
    if (! Array.isArray(req.session.cart)) {
        req.session.cart = [];
      };
    if (! req.session.number ) {
        req.session.number = 0;
    };
    if (! req.session.total ) {
        req.session.total = 0;
    }
    next();
})


// Router

const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
app.use('/', userRoutes);
app.use('/', itemRoutes);

// 404

app.all('*', (req, res, next) => {
    res.status(404).render('not_found')
})

// General error handler

app.use((err, req, res, next) => {
    let { statusCode } = err;
    if (!err.message) {
        err.message = 'Sorry, something went wrong.'
    }
    if (statusCode = 404) {
        res.render('not_found')
    } else {
        res.render('error', { err });
    }
})


app.listen(3000, () => {
    console.log("App running on port 3000");
});

