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
            statusMessage: ""
        }
    },
    methods: {
        onLoginClicked: function(){
            this.statusMessage = "";
            ClientLib.login(this.username, this.password)
                .then((result)=>{
                    if (result.authenticated){
                        window.location = ClientLib.APPLICATION_URL;
                    } else {
                        this.statusMessage = "Bad username/password"
                    }
                })
                .catch((err)=>{
                    this.statusMessage = "Unable to authenticate user";
                    console.log(err);
                })
        }
    },
    template: `
        <div class="form-signin">
            <div>{{statusMessage}}</div>

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