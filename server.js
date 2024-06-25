const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const ensureLoggedIn = require('./middleware/ensureLoggedIn');
const passGlobalDataToViews = require('./middleware/passGlobalDataToViews');

const authenticationController = require('./controllers/authentication');
const exercisesController = require('./controllers/exercises');
const socialsController = require('./controllers/socials');
// add more controllers here

const port = process.env.PORT ? process.env.PORT : '3000';

mongoose.connect(process.env.MONGODB_URI);

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

server.use(passGlobalDataToViews);

server.get('/', (req, res) => {
    res.render('index.ejs', {
        user: req.session.user,
    });
});

server.use('/authentication', authenticationController);
server.use('/socials', socialsController);
server.use('/exercises', ensureLoggedIn, exercisesController);
server.use(express.static('public'));

server.listen(port, () => {
    console.log(`The express app is ready to gooooooo on port ${ port }`);
});