const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Exercise = require('../models/exercise');

// Put index and show routes here

router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.render('users/index.ejs', {
            users: users
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const exercises = await Exercise.find({ user: req.params.id })
        .sort({ createdAt: 'desc' })
        .exec();

        user.exercises = exercises;

        res.render('users/show.ejs', {
            user: user
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;