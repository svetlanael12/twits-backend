const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'Secret-key'
}

module.exports = passport => {
  passport.use(
      new JwtStrategy(options, async (payload, done) => {
          try {
              const User = await mongoose.model('User')
              const user = await User.findOne({userId: payload.userId});

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