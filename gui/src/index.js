'use strict';
const axios = require('axios');
const myCss = require('./style/authModule.scss');

class AuthApp {
    constructor(){
        this._statusElem = document.querySelector("#statusMessage");
        this._buttonElem = document.querySelector("#loginButton");
        this._userElem = document.querySelector("#userInput");
        this._passwordElem = document.querySelector("#passwordInput");
        this._registerListeners();
    }
    _registerListeners(){
        this._buttonElem.addEventListener("click", this._onLoginClick = this._onLoginClick.bind(this));
    }
    _onLoginClick(){
        axios.post(window.location.origin + "/api/auth/authenticate", {username: this._userElem.value, password: this._passwordElem.value})
            .then((result)=>{
                if (result.data.authenticated){
                    window.location = "/public/auth/application.html"
                } else {
                    this._statusElem.textContent = "Bad username/password"
                }
            })
            .catch((err)=>{
                this._statusElem.textContent = "Error logging in!" + JSON.stringify(result.data);
                console.log(err);
            })
    }
}

module.exports = new AuthApp();