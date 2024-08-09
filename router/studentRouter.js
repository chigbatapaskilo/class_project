const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');
const { protect, isAdmin, isTeacher, isStudent } = require('../middleware/authentication');

// Routes for student management
router.post('/register', protect, isAdmin, studentController.registerStudent);
router.post('/update-scores', protect, isTeacher, studentController.updateScores);
router.get('/view-scores/:studentCode', protect, isStudent, studentController.viewScores);
router.get('/student/:studentCode', protect, isAdmin, studentController.getStudent);
router.get('/students', protect, isAdmin, studentController.getAllStudents);
router.delete('/student/:studentCode', protect, isAdmin, studentController.deleteStudent);

module.exports = router