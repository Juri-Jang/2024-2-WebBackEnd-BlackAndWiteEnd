const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const Reivew = require('../models/review');


exports.join = async (req,res,next) => {
    const {email, nick, password} = req.body;
    if (!email || !nick || !password) {
        return res.redirect('/join?error=null');
    }
    try {
        const exUser = await User.findOne({where: {email}});
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/login');
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

exports.login = (req,res,next) => {
    passport.authenticate('local', (authError,user,info) => {
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if(!user) {
            return res.redirect(`/login/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req,res,next);
};

exports.logout = (req,res) => {
    req.logout(()=> {
        res.redirect('/');
    });
};
