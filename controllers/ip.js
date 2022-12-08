const Ip = require('../models/ip');
const jwt = require('jsonwebtoken');
const logger = require('../logger');

// GET ALL IPs
exports.getIpList = (req, res, next) => {
    logger.info('GET getIpList');

    Ip.find()
        .then((list) => res.status(200).json(list))
        .catch((err) => {
            logger.error('GET getIpList', err);
            res.status(404).json({message : 'NOT FOUND'})
        });
}

// GET ONE IP
exports.getOneIp = (req, res, next) => {
    logger.info('GET getIp', req.params);
    Ip.findById(req.params.id)
        .then((ip) => res.status(200).json(ip))
        .catch((err) => {
            logger.error('GET getIp', err);
            res.status(404).json({message : 'NOT FOUND'})
        });
}

// CREATE ONE IP
exports.createIp = (req, res, next) => {
    logger.info('POST createIp', req.body);
    const token = req.headers.authorization;
    const decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodeToken.userId;

    const ip = new Ip({
        ipv4: req.body.ip,
        city: req.body.city,
        region: req.body.region,
        country: req.body.country,
        latln: req.body.loc,
        userId: userId,
        creationDate: new Date(),
        modificationDate: new Date(),
        active: true
    });
    ip.save()
        .then((saved) => res.status(200).json(saved))
        .catch((err) => {
            logger.error('POST createIp', err);
            res.status(500).json({message: 'API REST ERROR : Pb avec la création'});
        });
}

// PUT ONE IP
exports.updateIp = (req, res, next) => {
    logger.info('PUT updateIp' + req.params, req.body);

    Ip.findById(req.params.id)
        .then((ip) => {
            req.body.modificationDate = new Date();
            Ip.updateOne({ _id: ip.id}, req.body)
                .then((result) => {res.status(200).json(result);})
                .catch((err) => res.status(500).json({message: 'CANNOT UPDATE', error: err}))

        })
        .catch((err) => res.status(404).json({message: 'API REST ERROR : Pb avec la création'}))
}

// DELETE ONE IP
exports.deleteIp = (req, res, next) => {
    logger.info('DELTE deleteIp', req.params.id);

    Ip.findByIdAndDelete(req.params.id)
        .then((result) => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(500).json({message: 'ALREADY DELETED'})
            }

        })
        .catch((err) => res.status(500).json({message: 'CANNOT DELETE', error: err}))
}