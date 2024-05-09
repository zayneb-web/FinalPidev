const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const User = require('../models/user.js');
const JWT = require('jsonwebtoken');


module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log('-----------------------');
          console.log(profile);
          const user = await User.findOne({ googleId: profile.id });
          if (user) {
            const updatedUser = {
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '', 
              password: accessToken,
              
            };
            const result = await User.findOneAndUpdate(
              { _id: user.id },
              { $set: updatedUser },
              { new: true }
            );
            let token;
            try {
              token = generateToken(result.email);

            } catch (error) {
              console.error('Error generating token:', error);
              throw error;
            }


            return done(null, { user: result, token });

          } else {
            console.log('is here');
            const newUser = new User({
              googleId: profile.id,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
              password: accessToken,
              verified: true,
            });
            console.log('----------------------');
            console.log(newUser);
            const result = await newUser.save();

            let token;
            try {
              token = generateToken(result.email);
            } catch (error) {
              console.error('Error generating token:', error);
              throw error;
            }

            console.log('----------------------');
            console.log('token:', token);
            console.log('----------------------');

            return done(null, { user: result, token });
          }
        } catch (err) {
          console.log(err);
          return done(err);
        }
      }
    )
  );
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  function generateToken(email) {
    try {
      const tokenPayload = { email };
      const token = JWT.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
      return token;
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  }
};