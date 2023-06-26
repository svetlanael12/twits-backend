const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../model/User');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'Secret-key'
}

module.exports = passport => {
  passport.use(
      new JwtStrategy(options, async (jwt_payload, done) => {
          try {
            const ID = jwt_payload.userId
              const user = await User.findById(ID);
              if(user) {
                  done(null, user);
              } else {
                  done(null, false);
              }
          } catch(e) {
              console.log(e)
          }
          
      })
  )
}