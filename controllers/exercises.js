const express = require('express');
const router = express.Router();

const Exercise = require('../models/exercise');

// Home
router.get('/', async (req, res) => {
    try {
        const exercises = await Exercise.find({}).populate('user');
        console.log(exercises);
        res.render('exercises/index.ejs', {
            exercises: exercises
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// New
router.get('/new', (req, res) => {
    res.render('exercises/new.ejs');
});

// Create 
router.post ('/', async (req, res) => {
    try {
        req.body.user = req.session.user._id;
        await Exercise.create(req.body);
    } catch (error) {
        console.log(error);
    }
    res.redirect('/exercises');
})

// Index

// Edit

// Update

// Delete 

module.exports = router;