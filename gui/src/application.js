'use strict';
const ClientLib = require('../lib/clientLib');
const Vue = require('vue/dist/vue');
const myCss = require('./style/application.scss');
const appCmpnt = require('./components/application/app-cmpnt');

module.exports = new Vue({
    el: "#app",
    data: function(){
        return {
            applications: Array
        }
    },
    mounted: function(){
        this.initData();
    },
    methods: {
        onLogoutButtonClicked: function(){
            ClientLib.logout()
                .then(()=>{
                    window.location = ClientLib.AUTHENTICATION_URL;
                })
                .catch((err)=>{
                    console.log(err);
                })
        },
        initData: function(){
            let userInfo;
            let appInfo;
            
            return ClientLib.getMyUser()
                .then((result)=>{
                    userInfo = result;
                    return ClientLib.getApplicationDefinitions();
                })
                .then((result)=>{
                    let response = [];
                    appInfo = result;
                    userInfo.authorizedApps.forEach((appName)=>{
                        if (appInfo[appName]){
                            response.push(appInfo[appName]);
                        }  
                    })
                    this.applications = response;
                })
                .catch((err)=>{
                    console.log("Error getting Auth App info: ", err);
                })
        }
    },
    template: `
        <div>
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark justify-content-between">
                <a class="navbar-brand" href="#">Available Applications</a>
                <div>
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
