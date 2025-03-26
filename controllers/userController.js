const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

exports.createUser = async (req, res) => {
    try {
        // Extract the required fields from the request body
        const { fullName, password, email, gender } = req.body;
        // Check if the user already exists
        const userExists = await User.findOne({ where: { email: email.toLowerCase() } });
        if (userExists) {
            // Unlink the file from our local storage
            fs.unlinkSync(req.file.path)
            return res.status(400).json({
                message: `User with email: ${email} already exists`
            })
        };
        // Encrypt the user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error, data) => {
            if (error) {
                return res.status(400).json({
                    message: error.message
                })
            } else {
                return data
            }
        });
        // Unlink the file from our local storage
        fs.unlinkSync(req.file.path);

        // Create the user details
        const user = await User.create({
            fullName,
            password: hashedPassword,
            email: email.toLowerCase(),
            gender,
            media: result.secure_url
        });

        // Send a success response
        res.status(201).json({
            message: 'User created successfully',
            data: user
        });

    } catch (error) {
        if (req.file.path) {
            // Unlink the file from our local storage
            fs.unlinkSync(req.file.path)
        }
        res.status(500).json({ message: 'Error creating User: ' + error.message })
    }
}

exports.login = async (req, res) => {
    try {
        // 
    } catch (error) {
        res.status(500).json({ message: 'Error creating User: ' + error.message })
    }
}
