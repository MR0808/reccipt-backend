const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    console.log('authHeader - ' + authHeader);
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    console.log('token - ' + token);
    try {
        decodedToken = jwt.verify(token, process.env.LOGIN_SALT);
    } catch {
        req.isAuth = false;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;

    next();
};
