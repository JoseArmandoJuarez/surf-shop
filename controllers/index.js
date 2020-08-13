const User = require('../models/user');
const passport = require('passport');

module.exports = {
    async postRegister(req, res, next) {
        //Creating a new User and getting the values from the form
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        });

        // passing newUser 
        // passing in a password as the second argument to register to be hashed
        await User.register(newUser, req.body.password);
        res.redirect('/');
    },

    postLogin(req, res, next) {
        // runs a local strategy
        passport.authenticate('local', 
        {
          successRedirect: '/',
          failureRedirect: '/login'
        })(req, res, next);
    },

    getLogout(req, res, next) {
        req.logout();
        res.redirect('/');
    }
}