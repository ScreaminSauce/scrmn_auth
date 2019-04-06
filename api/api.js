'use strict';
const _ = require('lodash');
const UserApi = require('./user');
const AuthApi = require('./auth');

module.exports = (logger, basePath, dbConns)=>{
    return _.concat(
        UserApi(logger, basePath, dbConns),
        AuthApi(logger, basePath, dbConns)
    )
}