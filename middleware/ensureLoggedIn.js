const ensureLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/authentication/sign-in');
    }
};

module.exports = ensureLoggedIn;