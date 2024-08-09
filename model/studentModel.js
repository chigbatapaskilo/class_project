const mongoose = require('mongoose');

const defaultSubjects = ['english', 'maths', 'physics', 'chemistry', 'biology'];

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Teacher', 'Student'],
        default: 'Student',
    },
    studentCode: {
        type: Number,
        required: true,
    },
    subjects: {
        type: Map,
        of: Number,
        default: () => {
            const map = new Map();
            defaultSubjects.forEach(subject => map.set(subject, 0));
            return map;
        },
    },
    grade: {
        type: Number,
        default: 0,
    },
    totalScore: {
        type: Number,
        default: 0,
    },
    motivationalQuote: {
        type: String,
        default: '',
    },

  
    profilePicture: {
        public_id: { type: String },
        url: { type: String },
    },
});

module.exports = mongoose.model('Student', StudentSchema);