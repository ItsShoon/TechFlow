const express = require('express');
const router = express.Router();
const { getUserByEmail, updateUserByEmail } = require('../controllers/userController');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/user', getUserByEmail);
router.put('/users', updateUserByEmail);

module.exports = router;