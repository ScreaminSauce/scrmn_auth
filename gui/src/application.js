'use strict';
const axios = require('axios');

class MainApp {
    constructor(){
        this._statusElem = document.querySelector("#statusMessage");
        this._logoutElem = document.querySelector("#logoutButton");
        this._appList = document.querySelector("#authAppContainer");
        
        this._registerListeners();
        this.render();
    }
    _registerListeners(){
        this._logoutElem.addEventListener("click", this._onLogoutClick = this._onLogoutClick.bind(this));
    }
    _onLogoutClick(){
        axios.post(window.location.origin + "/api/auth/logout",{})
        .then(()=>{
            window.location = window.location.origin + "/public/auth/index.html"
        })
    }
    render(){
        let authApps;
        let allAppInfo;

        axios.get(window.location.origin + "/api/auth/authorized-apps")
            .then((result)=>{
                authApps = result.data;
                
                return axios.get(window.location.origin + "/api/reserved/appInfo")
            })
            .then((result)=>{
                allAppInfo = result.data;
                
                if(authApps && authApps.length > 0){
                    authApps.forEach((app)=>{
                        let appElem = document.createElement('div');
                        appElem.setAttribute("style", "width:100px;height:135px;border: 2px solid black;border-radius:15px;margin:20px;")
                        
                        let appIconElem = document.createElement('img');
                        appIconElem.setAttribute('src', allAppInfo[app].icon);

                        let appNameElem = document.createElement('div');
                        appNameElem.setAttribute('style','text-align:center;');
                        appNameElem.textContent = allAppInfo[app].displayName;
                    
                        this._appList.appendChild(appElem);
                        appElem.appendChild(appIconElem);
                        appElem.appendChild(appNameElem);

                        appElem.addEventListener('click', function(){
                            console.log("loading app: " + app);
                            console.log("Url: " + allAppInfo[app].urlSuffix)
                        })
                    })
                }
            })
            .catch((error)=>{
                if (error.response && error.response.data.statusCode === 401) {
                    window.location = window.location.origin + "/public/auth/index.html"
                  } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                  }
            })
    }
}

module.exports = new MainApp();
