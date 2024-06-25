const express = require('express');
const router = express.Router();

const Exercise = require('../models/exercise');
const User = require('../models/user.js');

// Home
router.get('/', async (req, res) => {
    try {
        const exercises = await Exercise.find({}).populate('user');
        const user = await User.findById(req.session.user._id);
        const index = exercises.user.findIndex((exercise)=> exercise._id === req.session.user._id)
        console.log(index);
        console.log(user);
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
router.get('/:id/edit', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        res.render('exercises/edit.ejs', {
            exercise: exercise
        });
    } catch (error) {
        console.log(error);
        res.redirect('/exercises');
    }
});
// Update
router.put('/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (exercise.user.equals(req.session.user._id)) {
            await exercise.updateOne(req.body);
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect('/exercises');
});

// Delete 
router.delete('/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).send('Exercise not found');
        }
        // Check if the exercise belongs to the current user
        if (!exercise.user.equals(req.session.user._id)) {
            return res.status(403).send('Unauthorized');
        }
        await exercise.deleteOne();
        res.redirect('/exercises');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// router.delete('/:id', async (req, res) => {
//     try {
//         const exercise = await Exercise.findById(req.params.id);
//         if (exercise.user.equals(req.session.user._id)) {
//             await exercise.deleteOne();
//         }
//     } catch (error) {
//         console.log(error);
//     }
//     res.redirect('/exercises');
// });

module.exports = router;