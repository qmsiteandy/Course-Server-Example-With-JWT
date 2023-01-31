const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt; // 用來取出 jwt
const User = require("../models").userModel;

// export a function
module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.JWT_SECRET;

  passport.use(
    new JwtStrategy(opts, (jwt_payload, cb) => {
      User.findOne({ _id: jwt_payload._id }, (err, user) => {
        if (err) return cb(err, null);
        if (user) return cb(null, user);
        else return cb(null, false);
      });
    })
  );
};
