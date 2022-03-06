'use strict';
const Joi = require('joi');
const Boom = require('@hapi/boom');
const UserLib = require('../lib/userLib');

module.exports = (logger, basePath, dbConns) => {
    let callUserLib = function(methodName, onError, ...args){
        let uLib = new UserLib(logger, dbConns);
        return uLib[methodName].call(uLib, ...args)
            .catch((err)=>{
                if (onError){
                    return onError(err);
                } else {
                    logger.error({ err, methodName: methodName});
                    Boom.internal("Error calling userLib." + methodName);
                }
            })
    }

    return [{
            method: "GET",
            path: basePath + "/myUser",
            handler: (request, h) => {
                return callUserLib("getUserByName", null, request.auth.credentials.username);
            }
        },
        {
            method: "GET",
            path: basePath + "/users",
            handler: (request, h) => {
                return callUserLib("getAllUsers", null, null);
            },
            config: {
                auth: {
                    access: {
                        scope: ["+auth-user-management"]
                    }
                }
            }
        },
        {
            method: "GET",
            path: basePath + "/user/id/{id}",
            handler: (request, h) => {
                return callUserLib("getUserById", null, request.params.id);
            },
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            config: {
                auth: {
                    access: {
                        scope: ["+auth-user-management"]
                    }
                }
            }
        },
        {
            method: "GET",
            path: basePath + "/user/email/{email}",
            handler: (request, h) => {
                return callUserLib("getUserByEmail", null, request.params.email);
            },
            config: {
                validate: {
                    params: {
                        email: Joi.string().required()
                    }
                }
            },
            config: {
                auth: {
                    access: {
                        scope: ["+auth-user-management"]
                    }
                }
            }
        },
        {
            method: "GET",
            path: basePath + "/user/name/{name}",
            handler: (request, h) => {
                return callUserLib("getUserByName", null, request.params.name);
            },
            config: {
                validate: {
                    params: {
                        name: Joi.string().required()
                    }
                }
            },
            config: {
                auth: {
                    access: {
                        scope: ["+auth-user-management"]
                    }
                }
            }
        },
        {
            method: "POST",
            path: basePath + "/user",
            handler: (request, h) => {
                let errorHandler = function(err){
                    if (err && err.message == "ERR_DUP_USER"){
                        return Boom.conflict("Username already exists");
                    } else {
                        logger.error({err, methodName: 'createUser'});
                        return Boom.internal("Error creating user")
                    }
                }

                return callUserLib("createUser", errorHandler, request.payload);
            },
            config: {
                validate: {
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required(),
                        email: Joi.string().required(),
                        authorizedApps: Joi.array().items(Joi.string().optional()).required()
                    }
                },
                auth: {
                    access: {
                        scope: ["+auth-user-management"]
                    }
                }
            }
        },
        {
            method: "PUT",
            path: basePath + "/user/id/{id}",
            handler: (request, h) => {
                let errorHandler = function(err){
                    if (err && err.message == "ERR_DUP_USER"){
                        return Boom.conflict("Username already exists");
                    } else {
                        logger.error({ err, methodName: 'updateUser'});
                        return Boom.internal("Error updating user.")
                    }
                }

                return callUserLib("updateUser", errorHandler, request.params.id, request.payload);
            },
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        username: Joi.string().optional(),
                        email: Joi.string().optional(),
                        password: Joi.string().optional(),
                        authorizedApps: Joi.array().items(Joi.string().optional()).required()
                    }
                },
                auth: {
                    access: {
                        scope: ["+auth-user-management"]
                    }
                }
            }
        },
        {
            method: "DELETE",
            path: basePath + "/user/id/{id}",
            handler: (request, h) => {
                return callUserLib("deleteUser", null, request.params.id);
            },
            config: {
                validate: {
                    params: {
                        id: Joi.string().required()
                    }
                },
                auth: {
                    access: {
                        scope: ["+auth-user-management"]
                    }
                }
            }
        }
    ]
}