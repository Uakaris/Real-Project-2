const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

// const passUserToViews = require('./middleware/passUserToViews.js');
// const ensureLoggedIn = require('./middleware/ensureLoggedIn.js');

const authenticationController = require('./controllers/authentication');
// add more controllers here

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODV_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${ mongoose.connection.name }.`);
});

server.use(express.urlencoded({ extended: false }));
server.use(methodOverride('_method'));
server.use(morgan('dev'));
server.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

// server.use(passUserToViews);

server.get('/', (req, res) => {
    res.render('index.ejs', {
        user: req.session.user,
    });
});

server.use('/authentication', authenticationController);
// add more use things here

server.listen(port, () => {
    console.log(`The express app is ready to gooooooo on port ${ port }`);
});