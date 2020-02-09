'use strict';
const _ = require('lodash');
const UserApi = require('./endpoints/user');
const AuthApi = require('./endpoints/auth');

module.exports = {
    name: "auth",
    type: "api",
    api: (logger, basePath, dbConns)=>{
        return [ ...UserApi(logger, basePath, dbConns), ...AuthApi(logger, basePath, dbConns)]
    },
    dbConnections: [
        {
            name: "auth",
            type: "mongo",
            url: process.env.MONGO_URI_AUTH,
            dbName: process.env.MONGO_DATABASE_AUTH
        }
    ]
}



