const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const { isAdmin } = require('../middlewares/authentication');
const SECRET_KEY = process.env.JWT_SECRET

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
        // Extract the User's Email and Password
        const { email, password } = req.body;
        // Find the user and check if they exist.
        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        };
        // Check if the user is paassing the right password
        const correctPassword = await bcrypt.compare(password, user.password);
        if (correctPassword === false) {
            return res.status(404).json({
                message: 'Incorrect Credentials'
            })
        };
        // Generate a token for the user on login
        const token = await jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, SECRET_KEY, { expiresIn: '1day' });
        // Send a success response
        res.status(200).json({
            message: 'Login successful',
            data: user,
            token
        })
    } catch (error) {
        res.status(500).json({ message: 'Error creating User: ' + error.message })
    }
}

exports.makeAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        if (user.isAdmin == true) {
            return res.status(400).json({
                message: 'User already an Admin'
            })
        }
        const admin = await User.update({ isAdmin: true }, { where: { id: id } });
        // console.log(admin)
        // user.gender = 'Male';
        // await user.save()
        res.status(200).json({
            message: 'User is now an Admin',
            data: admin
        })

    } catch (error) {
        res.status(500).json({ message: 'Error making User an Admin: ' + error.message })
    }
}
