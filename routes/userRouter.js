const { createUser } = require('../controllers/userController');
const upload = require('../utils/multer');

const router = require('express').Router();

router.post('/sign-up', upload.single('media'), createUser)

module.exports = router
