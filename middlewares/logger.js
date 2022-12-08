const logger = require('../logger');

module.exports = (req, res, next) => {
    try{
        logger.info('Middleware Logger');
        next();
    } catch {
        logger.error('Middleware Logger');
        res.status(401).json({message: "Erreur dans le middleware : Logger"});
    }
}