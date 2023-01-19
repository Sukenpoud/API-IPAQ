const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library');
const logger = require('../logger');

const CLIENT_ID = process.env.CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

// VERIFY TOKEN TO LOGIN WITH GOOGLE
async function verify(token, req, res) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        requiredAudience: CLIENT_ID
    });
    const payload = ticket.getPayload();

    User.findOne({email: payload.email})
        .then((user) => {
            if(!user) {
                req.body.email = payload.email;
                req.body.name = payload.name;
                req.body.password = payload.sub + new Date().getTime();

                bcrypt.hash(req.body.password, 10)
                    .then((hash) => {
                        const user = new User({
                            email: req.body.email,
                            password: hash,
                            name: req.body.name,
                            creationDate: new Date(),
                            modificationDate: new Date(),
                            active: true
                        });
            
                        user.save()
                            .then((saved) => {
                                logger.info('NEW USER');
                                res.status(200).json(saved);
                            })
                            .catch(() => {
                                logger.error('ERROR DURING USER CREATION');
                                res.status(500).json({message: 'API REST ERROR : Pb avec la création'})
                            });
                    })
                    .catch(() => res.status(500).json({message: 'API REST ERROR : Pb avec le chiffrement'}))
            } else {
                const token = jwt.sign({userId: user._id}, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h'});
                user.password = '';
                res.status(200).json({
                    token: token,
                    user: user
                })
            }
        })
        .catch((error) => {
            res.status(500).json({message: 'Request Error'});
        })
}

// GET ALL USERS
exports.getUserList = (req, res, next) => {
    logger.info('GET getUserList');

    User.find()
        .then((list) => res.status(200).json(list))
        .catch((err) => {
            logger.error('GET getUserList', err);
            res.status(404).json({message : 'NOT FOUND'})
        });
}

// GET ONE USER
exports.getOneUser = (req, res, next) => {
    logger.info('GET getUser', req.params);
    User.findById(req.params.id)
        .then((user) => res.status(200).json(user))
        .catch((err) => {
            logger.error('GET getUser', err);
            res.status(404).json({message : 'NOT FOUND'})
        });
}

// CREATE USER
exports.createUser = (req, res, next) => {
    logger.info('POST createUser', req.body);

    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
                name: req.body.name,
                creationDate: new Date(),
                modificationDate: new Date(),
                active: true
            });

            user.save()
                .then((saved) => {
                    logger.info('NEW USER');
                    res.status(200).json(saved);
                })
                .catch(() => {
                    logger.error('ERROR DURING USER CREATION');
                    res.status(500).json({message: 'API REST ERROR : Pb avec la création'})
                });
        })
        .catch(() => res.status(500).json({message: 'API REST ERROR : Pb avec le chiffrement'}))
}

// LOGIN
exports.login = (req, res, next) => {
    let token = req.body.token;
    if (token) {
        logger.info('USER LOGIN WITH GOOGLE');
        verify(token, req, res).catch(console.error);
    } else {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (!user) {
                    logger.error('USER LOGIN FAILED : WRONG EMAIL');
                    res.status(401).json({message: 'USER RESULT NULL'})
                } else {
                    bcrypt.compare(req.body.password, user.password)
                        .then((valid) => {
                            if (!valid) {
                                logger.error('USER LOGIN FAILED : WRONG PASSWORD');
                                res.status(500).json({message: 'API REST ERROR : COMPARISON FAILED'})
                            } else {
                                logger.info('USER LOGIN');
                                const token = jwt.sign({userId: user._id}, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h'});
                                user.password = '';
                                res.status(200).json({
                                    token: token,
                                    user: user
                                })
                            }
                        })
                        .catch((err) => {
                            logger.error('USER LOGIN FAILED : PASSWORD COMPARISON FAILED');
                            res.status(500).json({message: 'API REST ERROR : COMPARISON FAILED'})
                        })
                }
            })
            .catch(() => {
                logger.error('USER LOGIN FAILED');
                res.status(401).json({message: 'NOT FOUND'})
            })
    }

}

// UPDATE USER
exports.updateUser = (req, res, next) => {
    logger.info('PUT updateUser' + req.params, req.body);

    User.findById(req.params.id)
        .then((user) => {
            req.body.modificationDate = new Date();
            User.updateOne({ _id: user.id}, req.body)
                .then((result) => {res.status(200).json(result);})
                .catch((err) => res.status(500).json({message: 'CANNOT UPDATE', error: err}))

        })
        .catch((err) => {
            logger.error('PUT updateUser', err);
            res.status(404).json({message: 'API REST ERROR : Pb avec la création'});
        })
}

// DELETE USER
exports.deleteUser = (req, res, next) => {
    logger.info('DELETE deleteUser', req.params.id);

    User.findByIdAndDelete(req.params.id)
        .then((result) => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(500).json({message: 'ALREADY DELETED'})
            }

        })
        .catch((err) => {
            logger.error('DELETE deleteUser', err);
            res.status(500).json({message: 'CANNOT DELETE', error: err});
        })
}