const uuidv4 = require('uuid/v4');
const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const Boom = require('boom');
const AuthLib = require('../common/lib');

module.exports = (logger, basePath, dbConns)=>{
    return [
        {
            method: 'POST',
            path: basePath + "/authenticate",
            handler: (request, h) => {
                let db = dbConns.getConnection("auth");
                let sid = uuidv4();
                let userInfo;
                let authLib = new AuthLib(logger, db);

                return authLib.getUserInfo(request.payload.username)
                    .then((result)=>{
                        if (! _.isEmpty(result)){
                            userInfo = _.omit(result, "password", "_id")
                            return bcrypt.compare(request.payload.password, result.password);
                        } else {
                            return Promise.resolve(false);
                        }
                    })
                    .then((isAuthenticated)=>{
                        if (!isAuthenticated){
                            return {authenticated: false};
                        } else {
                            return request.server.app.cache.set(sid, {account: userInfo}, 0)
                                .then(()=>{
                                    request.cookieAuth.set({sid: sid});
                                    return {authenticated: true, user: userInfo};
                                })  
                        }
                    })
                    .catch((err)=>{
                        logger.error({error: err}, "Error running authenticate.");
                        return Boom.internal('Internal MongoDB error', err);
                    });
            },
            config: {
                validate: {
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                },
                auth: false,
                description: 'Login to application call',
                notes: 'Login method to system',
                tags: ['api']
            }
        },
        {
            method: "POST",
            path: basePath + "/logout",
            handler: (request, h)=>{
                logger.info("Calling /logout");
                request.server.app.cache.drop(request.state['screaminCookie'].sid);
                request.cookieAuth.clear();
                return {};
            }
        },
        {
            method: "GET",
            path: basePath + "/authorized-apps",
            handler: (request, h)=>{
                let db = dbConns.getConnection('auth');
                let authLib = new AuthLib(logger, db);
                return authLib.getUserInfo(request.auth.credentials.username)
                    .then((user)=>{
                        if (user){
                            return user.authorizedApps;
                        } else {
                            return null;
                        }
                    })
                    .catch((err)=>{
                        logger.error({error:err}, "Error getting user info.")
                        Boom.notFound("Unable to find user");
                    })
                }
        }
    ]
}