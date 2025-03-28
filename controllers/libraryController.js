const Library = require("../models/library");
const User = require("../models/user");

exports.createBook = async (req, res) => {
    try {
        const { userId: AdminId } = req.user;
        console.log('Request',req.user)
        const { name, author, genre, year } = req.body;
        const admin = await User.findByPk(AdminId);
        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found'
            })
        };
        const data = {
            name,
            author,
            genre,
            year,
            userId: AdminId
        };
        const book = await Library.create(data);
        res.status(201).json({
            message: 'Book created successfully',
            data: book
        })
    } catch (error) {
        res.status(500).json({ message: 'Error creating book' + error.message })
    }
}

