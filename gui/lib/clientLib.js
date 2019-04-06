'use strict';
const axios = require('axios');
const originBase = window.location.origin;

class ClientLib {
    static login(username, password){
        return axios.post(`${originBase}/api/auth/authenticate`, {username, password})
            .then((result)=>{
                return result.data;
            })
    }

    static logout(){
        return axios.post(`${originBase}/api/auth/logout`,{});
    }

    static getMyUser(){
        return axios(`${originBase}/api/auth/myUser`)
            .then((result)=>{
                return result.data;
            })
    }

    static getApplicationDefinitions(){
        return axios(`${originBase}/api/reserved/appInfo`)
            .then((result)=>{
                return result.data;
            })
    }

    static getUsers(){
        return axios.get(`${originBase}/api/auth/users`)
            .then((result)=>{
                return result.data;
            })
    }
    
    static createUser(user){
        return axios.post(`${originBase}/api/auth/user`, user)
            .then((result)=>{
                return result.data;
            })
            .catch((err)=>{
                return Promise.reject(err.response.data);
            })
    }

    static deleteUser(id){
        return axios.delete(`${originBase}/api/auth/user/id/${id}`);
    }

    static updateUser(id, updateObj){
        return axios.put(`${originBase}/api/auth/user/id/${id}`, updateObj)
            .then((result)=>{
                return result.data;
            })
            .catch((err)=>{
                return Promise.reject(err.response.data);
            })
    }
}   

module.exports = ClientLib;
ClientLib.APPLICATION_URL = "/public/auth/application.html";
ClientLib.AUTHENTICATION_URL = "/public/auth/index.html";
ClientLib.USER_MANAGEMENT_URL = "/public/auth/usermgmt.html";