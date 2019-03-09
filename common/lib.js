'use strict';
const _ = require('lodash');

class AuthLib {
    constructor(logger, dbConn){
        this._logger = logger;
        this._dbConn = dbConn;
    }

    getUserInfo(username){
        return this._dbConn.collection('users').findOne({username: username}, {"_listId":0})
            .then((user)=>{
                if (! _.isEmpty(user)){
                    return user;
                } else {
                    return null;
                }
            })
    }
}
module.exports = AuthLib;