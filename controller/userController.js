const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const cloudinary = require('../utils/couldinary')

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

exports.register = async (req, res) => {
    const { username, email, password,  } = req.body;
    try {

       

        const user = await User.create({ username,
             email,
              password,
             // role ,
             // profilePicture: { public_id: picture.public_id, url: picture.url },
            });
        const token = signToken(user._id);
        res.status(201).json({ token, data: { user } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = signToken(user._id);
        res.status(200).json({message:"login successfuly" ,token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.logout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
};