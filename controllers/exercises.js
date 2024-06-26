const express = require('express');
const router = express.Router();

const Exercise = require('../models/exercise');
const User = require('../models/user.js');

// Home
router.get('/', async (req, res) => {
    try {
        const exercises = await Exercise.find({ user: req.session.user._id }).populate('user');
        
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
router.get('/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        
        const exerciseHistory = await Exercise.find({
            user: req.session.user._id,
            exercise: exercise.exercise
        }).sort({ createdAt: 'desc' });

        res.render('exercises/show.ejs', {
            exercise: exercise,
            exerciseHistory: exerciseHistory
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Edit
router.get('/:exerciseId/:entryId/edit', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.exerciseId);
        if (!exercise) {
            return res.status(404).send('Exercise not found');
        }
        const historyItem = await Exercise.findById(req.params.entryId);
        if (!historyItem) {
            return res.status(404).send('Exercise history item not found');
        }
        res.render('exercises/edit.ejs', {
            exercise: exercise,
            historyItem: historyItem
        });
    } catch (error) {
        console.log(error);
        res.redirect('/exercises');
    }
});

// router.get('/:id/edit', async (req, res) => {
//     try {
//         const exercise = await Exercise.findById(req.params.id);
//         res.render('exercises/edit.ejs', {
//             exercise: exercise
//         });
//     } catch (error) {
//         console.log(error);
//         res.redirect('/exercises');
//     }
// });

// Update
router.put('/:exerciseId/:entryId', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.exerciseId);
        if (!exercise) {
            return res.status(404).send('Exercise not found');
        }
        const historyItem = await Exercise.findById(req.params.entryId);
        if (!historyItem) {
            return res.status(404).send('Exercise history item not found');
        }
        // Check if the exercise history item belongs to the current user
        if (!historyItem.user.equals(req.session.user._id)) {
            return res.status(403).send('Unauthorized');
        }
        // Update the fields in historyItem based on req.body
        historyItem.sets = req.body.sets;
        historyItem.reps = req.body.reps;
        historyItem.weight = req.body.weight;
        historyItem.notes = req.body.notes;
        await historyItem.save();
        res.redirect(`/exercises/${req.params.exerciseId}`);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


// router.put('/:id', async (req, res) => {
//     try {
//         const exercise = await Exercise.findById(req.params.id);
//         if (exercise.user.equals(req.session.user._id)) {
//             await exercise.updateOne(req.body);
//         }
//     } catch (error) {
//         console.log(error);
//     }
//     res.redirect('/exercises');
// });

// Delete
router.delete('/:exerciseId/:entryId', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.exerciseId);
        if (!exercise) {
            return res.status(404).send('Exercise not found');
        }
        const historyItem = await Exercise.findById(req.params.entryId);
        if (!historyItem) {
            return res.status(404).send('Exercise history item not found');
        }
        // Check if the exercise history item belongs to the current user
        if (!historyItem.user.equals(req.session.user._id)) {
            return res.status(403).send('Unauthorized');
        }
        await historyItem.deleteOne();
        res.redirect(`/exercises/${req.params.exerciseId}`);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// router.delete('/:id', async (req, res) => {
//     try {
//         const exercise = await Exercise.findById(req.params.id);
//         if (!exercise) {
//             return res.status(404).send('Exercise not found');
//         }
//         // Check if the exercise belongs to the current user
//         if (!exercise.user.equals(req.session.user._id)) {
//             return res.status(403).send('Unauthorized');
//         }
//         await exercise.deleteOne();
//         res.redirect('/exercises');
//     } catch (error) {
//         console.log(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

module.exports = router;