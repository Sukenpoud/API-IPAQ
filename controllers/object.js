const Object = require('../models/object')
const logger = require('../logger');

exports.getObjectList = (req, res, next) => {
    logger.info('GET getObjectList');

    Object.find()
        .then((list) => res.status(200).json(list))
        .catch((err) => {
            logger.error('GET getObjectList', err);
            res.status(404).json({message : 'NOT FOUND'})
        });
}

exports.getOneObject = (req, res, next) => {
    logger.info('GET getObject', req.params);
    Object.findById(req.params.id)
        .then((obj) => res.status(200).json(obj))
        .catch((err) => {
            logger.error('GET getObject', err);
            res.status(404).json({message : 'NOT FOUND'})
        });
}

exports.createObject = (req, res, next) => {
    logger.info('POST createObject', req.body);
    const obj = new Object({
        name: req.body.name,
        weight: req.body.weight,
        url: '',
        creationDate: new Date(),
        modificationDate: new Date(),
        active: true
    });
    obj.save()
        .then((saved) => res.status(200).json(saved))
        .catch((err) => {
            logger.error('POST createObject', err);
            res.status(500).json({message: 'API REST ERROR : Pb avec la création'});
        });
}

exports.updateObject = (req, res, next) => {
    logger.info('PUT updateObject' + req.params, req.body);

    Object.findById(req.params.id)
        .then((obj) => {
            req.body.modificationDate = new Date();
            Object.updateOne({ _id: obj.id}, req.body)
                .then((result) => {res.status(200).json(result);})
                .catch((err) => res.status(500).json({message: 'CANNOT UPDATE', error: err}))

        })
        .catch((err) => res.status(404).json({message: 'API REST ERROR : Pb avec la création'}))
}

exports.deleteObject = (req, res, next) => {
    logger.info('DELTE deleteObject', req.params.id);

    Object.findByIdAndDelete(req.params.id)
        .then((result) => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(500).json({message: 'ALREADY DELETED'})
            }

        })
        .catch((err) => res.status(500).json({message: 'CANNOT DELETE', error: err}))
}

// const obj = new Object({
//     name: 'Chaise',
//     weight: 8,
//     url: '',
//     creationDate: new Date(),
//     modificationDate: new Date(),
//     active: true
// });
//
// obj.save()
//     .then((saved) => console.log('OK', saved))
//     .catch((err) => console.log('ERROR', err))