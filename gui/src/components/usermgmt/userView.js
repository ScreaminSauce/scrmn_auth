'use strict';
const Vue = require('vue/dist/vue');

module.exports = Vue.component('user-view', {
    props: {
        user: Object
    },
    computed: {
        authApps: function(){
           return this.user.authorizedApps.join(", ");
        }
    },
    methods: {
        onDeleteButtonClicked: function(){
            this.$emit('delete-user');
        },
        onEditButtonClicked: function(){
            this.$emit('edit-user');
        }
    },
    template: `
    <tr>
        <th scope="row">{{user.username}}</th>
        <td>{{user.email}}</td>
        <td>{{authApps}}</td>
        <td class="form-group">
            <button class="btn btn-danger" v-on:click="onDeleteButtonClicked">Delete</button>    
            <button class="btn btn-primary" v-on:click="onEditButtonClicked">Edit</button>
        </td>
    </tr>
    `
});