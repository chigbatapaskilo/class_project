const Student = require('../model/studentModel');
const axios = require('axios');

// Default subjects
const defaultSubjects = ['english', 'maths', 'physics', 'chemistry', 'biology'];

// Register a new student
exports.registerStudent = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Convert the array of default subjects into an object with default scores
        const subjectsMap = {};
        defaultSubjects.forEach(subject => {
            subjectsMap[subject] = 0;
        });

        // Generate a unique 4-digit code
        const studentCode = Math.floor(1000 + Math.random() * 9000);

        const student = new Student({
            name,
            email,
            studentCode,
            subjects: subjectsMap,
        });

        await student.save();

        res.status(201).json({
            message: "Registration successful",
            studentCode,
            student,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update scores for a student
exports.updateScores = async (req, res) => {
    try {
        const { email, scores } = req.body;

        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Ensure student.subjects is a Map
        if (!(student.subjects instanceof Map)) {
            // Convert subjects to a Map if not already
            student.subjects = new Map(Object.entries(student.subjects));
        }

        // Update the student's scores
        for (const [subject, score] of Object.entries(scores)) {
            student.subjects.set(subject, score); // Add or update subject score
        }

        // Calculate the total score and overall grade
        student.totalScore = Array.from(student.subjects.values()).reduce((acc, score) => acc + score, 0);
        student.grade = student.totalScore;

        // Fetch a motivational quote
        const response = await axios.get('https://api.quotable.io/random');
        const quote = response.data.content;

        // Save the quote to the student's record
        student.motivationalQuote = quote;

        await student.save();

        res.status(200).json({ message: 'Scores updated successfully', student });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Student views their scores and motivational quote
exports.viewScores = async (req, res) => {
    try {
        const { studentCode } = req.params;

        const student = await Student.findOne({ studentCode });

        if (!student) {
            return res.status(404).json({ error: 'Invalid student code' });
        }

        // Convert Map to an array for easy manipulation
        const subjectsArray = Array.from(student.subjects.entries());

        const result = subjectsArray.map(([subject, score]) => ({
            subject,
            score
        }));

        res.status(200).json({
            name: student.name,
            email: student.email,
            scores: result,
            totalGrade: student.grade,
            motivationalQuote: student.motivationalQuote || "No motivational quote available"
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single student by studentCode or email
exports.getStudent = async (req, res) => {
    try {
        const { studentCode, email } = req.params;

        const student = await Student.findOne({ $or: [{ studentCode }, { email }] });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Convert Map to an array for easy manipulation
        const subjectsArray = Array.from(student.subjects.entries());

        const result = subjectsArray.map(([subject, score]) => ({
            subject,
            score
        }));

        res.status(200).json({
            name: student.name,
            email: student.email,
            scores: result,
            totalGrade: student.grade,
            motivationalQuote: student.motivationalQuote || "No motivational quote available"
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();

        if (students.length === 0) {
            return res.status(404).json({ error: 'No students found' });
        }

        // Format the students list
        const results = students.map(student => ({
            name: student.name,
            email: student.email,
            studentCode: student.studentCode,
            totalGrade: student.grade
        }));

        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a student by studentCode or email
exports.deleteStudent = async (req, res) => {
    try {
        const { studentCode, email } = req.params;

        const student = await Student.findOneAndDelete({ $or: [{ studentCode }, { email }] });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully', student });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};