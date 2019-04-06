'use strict';
const Vue = require('vue/dist/vue');

module.exports = Vue.component('app-cmpnt', {
    props: {
        app: Object
    },
    methods: {
        onAppClicked: function(){
            window.location = window.location.origin + this.app.urlPath;
        }
    },
    template: `
        <div v-on:click="onAppClicked" class="card text-center">
            <img v-bind:src="app.icon" class="card-img-top app-icon" >
            <div class="card-body">
            <h5 class="card-title">{{app.displayName}}</h5>
            <p class="card-text">{{app.description}}</p>
            </div>
        </div>
    `
})