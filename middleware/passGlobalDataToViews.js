const passGlobalDataToViews = (req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.title = 'Lift Tracker';
    next();
}

module.exports = passGlobalDataToViews;