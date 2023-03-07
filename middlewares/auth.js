const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
} 

const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

passport.use('login', new LocalStrategy(
    (username, password, done) => {
        User.findOne({
            username
        }, (error, user) => {
            if (error) { return done(error); } 

            if (!user) {
                console.log(`El usuario ${username} no existe`);
                return done(null, false);
            }

            if (!isValidPassword(user, password)) {
                console.log("Password incorrecta");
                return done(null, false);
            }

            return done(null, user);
        })
    }
));

passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    },
    (req, username, password, done) => {
        User.findOne({
            'username': username
        }, (error, user) => {
            
            if (error) {
                console.log(`Error al registrar usuario ${error}`);
                return done(error);
            } 

            if (user) {
                console.log(`El usuario ${username} ya existe`);
                return done(null, false);
            }

            const newUser = {
                username,
                password: createHash(password)
            }

            User.create(newUser, (error, userWithId) => {
                if (error) {
                    console.log(`Error al registrar usuario en DB ${error}`);
                    return done(error);
                }
                console.log(`Usuario registrado`);
                console.log(user);

                return done(null, userWithId);
            });
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done)
});

const checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = checkAuthentication;