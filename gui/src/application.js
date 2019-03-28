'use strict';
const axios = require('axios');
const myCss = require('./style/application.scss');
const Vue = require('vue/dist/vue');
const appCmpnt = require('./components/app-cmpnt');
const _ = require('lodash');

module.exports = new Vue({
    el: "#app",
    data: {
        applications: []
    },
    mounted: function(){
        this.fetchAuthAppInfo()
            .then((authorizedApps)=>{
                this.applications = authorizedApps;
            })
    },
    methods: {
        onLogoutButtonClicked: function(){
            axios.post(window.location.origin + "/api/auth/logout",{})
                .then(()=>{
                    window.location = window.location.origin + "/public/auth/index.html"
                })
                .catch((err)=>{
                    console.log(err);
                })
        },
        fetchAuthAppInfo: function(){
            let userInfo;
            let appInfo;
            return this.fetchUserInfo()
                .then((result)=>{
                    userInfo = result.data;
                    console.log("User: ", result.data);
                    return axios(window.location.origin + "/api/reserved/appInfo")
                })
                .then((result)=>{
                    appInfo = result.data;
                    console.log("AppInfo: ", result.data);
                    let response = [];
                    userInfo.authorizedApps.forEach((appName)=>{
                        if (_.has(appInfo, appName)){
                            response.push(appInfo[appName]);
                        }  
                    })
                    return response;
                })
                .catch((err)=>{
                    console.log("Error getting Auth App info: ", err);
                })
        },
        fetchUserInfo: function(){
            return axios(window.location.origin + "/api/auth/myUser");
        }
    },
    template: `
    <div>
        <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <a class="navbar-brand" href="#">Available Applications</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto">
                    <!-- TODO: Self User Managment -->
                </ul>
                <div class="form-inline mt-2 mt-md-0">
                    <button v-on:click="onLogoutButtonClicked" class="btn btn-outline-success my-2 my-sm-0">Logout</button>
                </div>
            </div>
        </nav>

        <main role="main" class="container main-body">
        <div class="card-deck">
            <app-cmpnt v-for="(app, index) in applications"
            :key="app.Name"
            :app="app"
            ></app-cmpnt>
        </div>
            
        </main>
    </div>
    `
});
