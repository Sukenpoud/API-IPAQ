const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../logger');

module.exports = (req, res, next) => {
    try{
        logger.info('Middleware Auth OK');
        const email = req.headers.email;
        const token = req.headers.authorization;
        const decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        User.findById(decodeToken.userId)
            .then((user) => {
                if (email == user.email) {
                    next();
                } else {
                    res.status(403).json({message: "UNAUTHORIZED"});
                }
            })
            .catch(() => res.status(403).json({message: "UNAUTHORIZED"}))
    } catch {
        logger.error('Middleware Auth Error');
        res.status(403).json({message: "Erreur dans le middleware : Auth"});
    }
}