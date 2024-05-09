const passport = require('passport');
const { register, login } = require('../Controllers/auth.js');
const express = require('express');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  }
);

router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({ message: 'User logged in', user: req.user });
  } else {
    res.status(400).json({ message: 'Not Authorized' });
  }
});

module.exports = router;