const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    exercise: {
        type: String,
        required: true,
    },
    sets: {
        type: Number,
        required: true,
    },
    reps: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    notes: {
        type: String,
    },
    // TODO: favoritedByUsers
});

module.exports = mongoose.model('Exercise', exerciseSchema);