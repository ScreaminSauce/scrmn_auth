'use strict';
const axios = require('axios');
const myCss = require('./style/authModule.scss');
const Vue = require('vue/dist/vue');

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

            axios.post(window.location.origin + "/api/auth/authenticate", {username: this.username, password: this.password})
            .then((result)=>{
                if (result.data.authenticated){
                    window.location = "/public/auth/application.html"
                } else {
                    this.statusMessage = "Bad username/password"
                }
            })
            .catch((err)=>{
                this._statusElem = "Unable to authenticate user";
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
            <input type="password" id="passwordInput" v-model="password" class="form-control" placeholder="Password" required>
            <div class="mb-3"></div>
            <button v-on:click="onLoginClicked" class="btn btn-lg btn-primary btn-block">Sign in</button>
            <p class="mt-5 mb-3 text-muted">&copy; 2019</p>
        </div>
    `
})