'use strict';
const UserLib = require('../lib/userLib');
const Joi = require('joi');
const uuidv4 = require('uuid').v4;
const Boom = require('@hapi/boom');
const _ = require('lodash');

module.exports = (logger, basePath, dbConns)=>{
    return [
        {
            method: 'POST',
            path: basePath + "/authenticate",
            handler: (request, h) => {
                let sid = uuidv4();
                let userLib = new UserLib(logger, dbConns);

                return userLib.authenticate(request.payload.username, request.payload.password)
                    .then((result)=>{
                        if (! result.isAuthenticated){
                            return {authenticated: false};
                        } else {
                            return request.server.app.cache.set(sid, {account: result.userInfo}, 0)
                                .then(()=>{
                                    request.cookieAuth.set({sid: sid});
                                    return {authenticated: true, user: result.userInfo};
                                })  
                        }
                    })
                    .catch((err)=>{
                        logger.error({err}, "Error running authenticate.");
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
                auth: false
            }
        },
        {
            method: "POST",
            path: basePath + "/logout",
            handler: (request, h)=>{
                logger.info("Calling POST /logout");
                if (_.has(request, "state." + process.env.COOKIE_AUTH_NAME)){
                    request.server.app.cache.drop(request.state[process.env.COOKIE_AUTH_NAME].sid);
                }
                request.cookieAuth.clear();
                return {};
            },
            config: {
                auth: false
            }
        },
    ]
}