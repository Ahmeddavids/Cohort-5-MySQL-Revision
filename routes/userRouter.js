const { createUser, login, makeAdmin } = require('../controllers/userController');
const upload = require('../utils/multer');

const router = require('express').Router();

router.post('/sign-up', upload.single('media'), createUser);

router.post('/login', login);

router.put('/make-admin/:id', makeAdmin);

module.exports = router
