'use strict';
const ClientLib = require('../lib/clientLib');
const Vue = require('vue/dist/vue');
const myCss = require('./style/login.scss');

module.exports = new Vue({
    el: "#app",
    data: function(){
        return {
            username: "",
            password: "",
            errorMessage: ""
        }
    },
    mounted: function(){
        let params = new URLSearchParams(document.location.search.substring(1));
        let errCode = params.get("errCode");
        if (errCode){
            switch(errCode){
                case "1":
                    this.errorMessage = "Account signed out. Please sign in"
                    break;
                case "2":
                    this.errorMessage = "Account not authorized"
            }
            
        }
    },
    methods: {
        onLoginClicked: function(){
            this.errorMessage = "";
            ClientLib.login(this.username, this.password)
                .then((result)=>{
                    if (result.authenticated){
                        window.location = ClientLib.APPLICATION_URL;
                    } else {
                        this.errorMessage = "Bad username/password"
                    }
                })
                .catch((err)=>{
                    this.errorMessage = "Unable to authenticate user";
                    console.log(err);
                })
        }
    },
    template: `
        <div class="form-signin">
            <div v-if="errorMessage" class="alert alert-danger" role="alert">{{errorMessage}}</div>

            <img class="mb-4 logo-icon" src="/public/auth/images/domo.jpg" alt="" width="144" height="144">
            
            <h1 class="h3 mb-3 font-weight-normal">ScreaminServer Login</h1>
            
            <label for="userInput" class="sr-only">Username</label>
            
            <input type="text" id="userInput" v-model="username" class="form-control" placeholder="Username" required autofocus>
            
            <label for="passwordInput" class="sr-only">Password</label>
            
            <input type="password" id="passwordInput" v-model="password" v-on:keyup.enter="onLoginClicked" class="form-control" placeholder="Password" required>
            
            <div class="mb-3"></div>
            
            <button v-on:click="onLoginClicked" class="btn btn-lg btn-primary btn-block">Sign in</button>
            
            <p class="mt-5 mb-3 text-muted">&copy; 2019</p>
        </div>
    `
})