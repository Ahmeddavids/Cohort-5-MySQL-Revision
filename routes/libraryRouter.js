const { createBook } = require('../controllers/libraryController');
const { authenticate, isAdmin } = require('../middlewares/authentication');

const router = require('express').Router();

router.post('/create', authenticate, isAdmin, createBook);

module.exports = router;
