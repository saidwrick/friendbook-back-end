const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
// const bcrypt = require("bcryptjs");

passport.use(
    new LocalStrategy({
        usernameField: "email"
    },
    (email, password, done) => {
        console.log("hello");
        User.findOne({ email: email }, (err, user) => {
            if (err) { 
            return done(err);
            }
            if (!user) {
            return done(null, false, { message: "Incorrect email" });
            }
            if (user.password == password){
                return done(null, user);
            }
            else {
                return done(null, false, {message: "Incorrect password"});
            }
        })
    })
);

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'secret'
    },
    function (jwtPayload, done) {;
        User.findById(jwtPayload.userId).exec( function (err, user){
            if (user){
                return done(null,user);
            }
            else {
                return done(err);
            }
        })
    }
));

module.exports = passport;