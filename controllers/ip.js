const Ip = require('../models/ip');
const jwt = require('jsonwebtoken');
const logger = require('../logger');
const { IPinfoWrapper } = require("node-ipinfo");
const axios = require('axios');


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

// CREATE ONE IP BEFORE IMPLEMENTING AUTH
exports.insertIp = (req, res, next) => {
    const ipinfo = new IPinfoWrapper(process.env.IPINFO_TOKEN);
    logger.info('TEST API IPINFO', req.body);

    // FIRST API CALL "IPINFO"
    ipinfo.lookupIp(req.body.ip).then((response) => {
        const ipv4 = response.ip;
        let coords = response.loc;
        let coordArray = coords.split(',');
        const [latitude, longitude] = coordArray;
        const airvisualKey = "f20d1f24-a012-4267-9674-d98c66228c6f";

        // SECOND API CALL "AIRVISUAL"
        axios.get('http://api.airvisual.com/v2/nearest_city', {
            params: {
                lat: latitude,
                lon: longitude,
                key: airvisualKey
            }
          })
            .then(response => {
              console.log(response.data.data);
              
              const ip = new Ip({
                  ipv4: ipv4,
                  latitude: latitude,
                  longitude: longitude,
                  city: response.data.data.city,
                  region: response.data.data.state,
                  country: response.data.data.country,
                  pollution: response.data.data.current.pollution,
                  weather: response.data.data.current.weather,
                  userId: "userId", // TODO : AJOUTER L'ID USER
                  creationDate: new Date(),
                  modificationDate: new Date(),
                  active: true
              });
              ip.save()
                  .then((saved) => {
                      logger.info('POST createIp');
                      res.status(200).json(saved);
                  })
                  .catch((err) => {
                      logger.error('POST createIp', err);
                      res.status(500).json({message: 'API REST ERROR : save error'});
                  });
            })
            .catch(error => {
                logger.error('POST createIp AIRVISUAL API CALL', error);
            });
    })
    .catch((err) => {
        logger.error('POST createIp : ipinfo API call', err);
        res.status(500).json({message: 'API REST ERROR : ipinfo API call'});
    });
}

// CREATE ONE IP AFTER IMPLEMENTING AUTH
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
    logger.info('DELETE deleteIp', req.params.id);

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

// const obj = new Ip({
//     ipv4: "192.0.0.0",
//     city: "Paris",
//     region: "Ile de France",
//     country: "France",
//     latln: "48.86244755473046, 2.295191654042415",
//     userId: "user1",
//     creationDate: new Date(),
//     modificationDate: new Date(),
//     active: true
// });

// obj.save()
//     .then((saved) => console.log('OK', saved))
//     .catch((err) => console.log('ERROR', err))