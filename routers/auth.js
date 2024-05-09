const { register, login } = require('../Controllers/auth.js');
const express = require('express');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({ message: 'User logged in', user: req.user });
  } else {
    res.status(400).json({ message: 'Not Authorized' });
  }
});

module.exports = router;