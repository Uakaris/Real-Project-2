const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    exercise: {
        type: String,
        enum: ['back squat', 'barbell back rack reverse lunge', 'barbell good morning', 'behind the neck press', 'bench press', 'bent over dumbbell row', 'chin up', 'clean', 'clean pull', 'dumbbell box step up', 'deadlift', 'deficit deadlift', 'dumbbell bench press', 'front squat', 'hang clean', 'hang muscle snatch', 'hang power clean', 'hang power clean + push jerk', 'hang snatch', 'hang power snatch', 'hang squat snatch', 'hip clean', 'hip snatch', 'low hang power clean', 'low hang snatch + overhead squat', 'overhead squat', 'power clean', 'power clean + jerk', 'power snatch', 'push jerk', 'push press', 'romanian deadlift', 'seated barbell strict press', 'single arm dumbbell row', 'snatch', 'strict press', 'pull up', 'bar muscle up', 'ring muscle up', 'strict ring muscle up', 'strict handstand push up'],
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
    },
    notes: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // TODO: favoritedByUsers
}, {
    timestamps: true
});


module.exports = mongoose.model('Exercise', exerciseSchema);