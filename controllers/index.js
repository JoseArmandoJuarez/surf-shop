const User = require('../models/user');

module.exports = {
    postRegister(req, res, next) {
        //Creating a new User and getting the values from the form
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            image: req.body.image
        });

        // passing newUser 
        // passing in a password as the second argument to register to be hashed
        User.register(newUser, req.body.password, (err) => {
            if(err){
                console.log('error while user register!', err);
                return next(err);
            }
            console.log('user registered!');
            res.redirect('/');
        });
    }
}