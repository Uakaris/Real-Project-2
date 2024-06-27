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
        
        const historyItem = await Exercise.findById(req.params.entryId);
        
        res.render('exercises/edit.ejs', {
            exercise: exercise,
            historyItem: historyItem
        });
    } catch (error) {
        console.log(error);
        res.redirect('/exercises');
    }
});

// Update
router.put('/:exerciseId/:entryId', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.exerciseId);
        
        const historyItem = await Exercise.findById(req.params.entryId);
        
        historyItem.sets = req.body.sets;
        historyItem.reps = req.body.reps;
        historyItem.weight = req.body.weight;
        historyItem.notes = req.body.notes;
        await historyItem.save();
        res.redirect(`/exercises/${req.params.exerciseId}`);
    } catch (error) {
        console.log(error);
        res.redirect('/exercises');
    }
});

// Delete
router.delete('/:exerciseId/:entryId', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.exerciseId);
    
        const historyItem = await Exercise.findById(req.params.entryId);
        
        await historyItem.deleteOne();
        res.redirect(`/exercises/${req.params.exerciseId}`);
    } catch (error) {
        console.log(error);
        res.redirect('/exercises');
    }
});

module.exports = router;