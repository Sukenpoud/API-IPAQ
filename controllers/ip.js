const Ip = require('../models/ip');
const jwt = require('jsonwebtoken');
const logger = require('../logger');
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

// GET ALL IPS OF A USER
exports.getUserIpList = (req, res, next) => {
    logger.info('GET getIpList  of one user');
    const token = req.headers.authorization;
    const decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodeToken.userId;

    Ip.find({userId: userId})
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
    logger.info('TEST API IPINFO');
    const token = req.headers.authorization;
    const decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodeToken.userId;

    // FIRST API CALL "IPINFO"
    axios.get('http://ipinfo.io/'+req.body.ip, {
        params: {
            token: process.env.IPINFO_TOKEN
        }
    })
    .then((response) => {
        const ipv4 = response.data.ip;
        let coords = response.data.loc;
        let coordArray = coords.split(',');
        const [latitude, longitude] = coordArray;
        const airvisualKey = process.env.AIRVISUAL_KEY;

        // SECOND API CALL "AIRVISUAL"
        axios.get('http://api.airvisual.com/v2/nearest_city', {
            params: {
                lat: latitude,
                lon: longitude,
                key: airvisualKey
            }
          })
            .then(response => {            
              const ip = new Ip({
                  ipv4: ipv4,
                  latitude: latitude,
                  longitude: longitude,
                  city: response.data.data.city,
                  region: response.data.data.state,
                  country: response.data.data.country,
                  pollution: response.data.data.current.pollution,
                  weather: response.data.data.current.weather,
                  userId: userId,
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

// PUT ONE IP
exports.updateIp = (req, res, next) => {
    logger.info('PUT updateIp');

    Ip.findById(req.params.id)
        .then((ip) => {
            req.body.modificationDate = new Date();
            Ip.updateOne({ _id: ip.id}, req.body)
                .then((result) => {
                    logger.info('PUT updateIp : IP UPDATED');
                    res.status(200).json(result);
                })
                .catch((err) => {
                    logger.error('PUT updateIp : CANNOT UPDATE IP');
                    res.status(500).json({message: 'CANNOT UPDATE', error: err})
                })

        })
        .catch((err) => {
            logger.error('API REST ERROR : UPDATE IP FAIL');
            res.status(404).json({message: 'API REST ERROR : UPDATE IP FAIL'})
        })
}

// DELETE ONE IP
exports.deleteIp = (req, res, next) => {
    logger.info('DELETE deleteIp', req.params.id);

    Ip.findByIdAndDelete(req.params.id)
        .then((result) => {
            if (result) {
                logger.info('DELETE deleteIp : IP DELETED');
                res.status(200).json(result);
            } else {
                logger.error('DELETE deleteIp : IP ALREADY DELETED');
                res.status(500).json({message: 'ALREADY DELETED'});
            }

        })
        .catch((err) => {
            logger.error('DELETE deleteIp : CANNOT DELETE IP');
            res.status(500).json({message: 'CANNOT DELETE', error: err})
        })
}