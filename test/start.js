'use strict';
require('dotenv').config({path: "test/.env"});
const ScreaminServer = require('@screaminsauce/screaminserver');
const AuthModuleApi = require("../").api;
const AuthModuleGui = require("../").gui;

let server = new ScreaminServer({
    name: 'authTest',
    options: {
        port: 3000,
        host: 'localhost'
    },
    modules: [AuthModuleApi, AuthModuleGui],
    auth: {
        secret: 'ThisIsATestSecretThisIsATestSecretThisIsATestSecret',
        cookieName: process.env.COOKIE_AUTH_NAME,
        isSecure: false
    },
    defaultGuiRoute: "/public/auth/login.html"
});


process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})

server.startup()
    .catch((err) => {
        console.log(err);
        console.log("Error starting system");
        process.exit(1);
    })