'use strict';
const ClientLib = require('../../../lib/clientLib');
const Vue = require('vue/dist/vue');
const _ = require('lodash');

module.exports = Vue.component('user-edit', {
    props: {
        user: Object,
        appList: Array
    },
    data: function(){
        return {
            editedUser: Object,
            availableApps: Array,
            statusMessage: ""
        }
    },
    mounted: function(){
        this.editedUser = _.cloneDeep(this.user);
        this.editedUser.password = "";        
        this.availableApps = _.cloneDeep(this.appList)
    },
    methods: {
        onSaveButtonClicked: function(){
            this.statusMessage = "";
            let toBeSaved = {
                email: this.editedUser.email,
                authorizedApps: this.editedUser.authorizedApps
            }
            if (! _.isEmpty(this.editedUser.password)){
                toBeSaved.password = this.editedUser.password
            }
            if (this.editedUser.username != this.user.username){
                toBeSaved.username = this.editedUser.username;
            }

            ClientLib.updateUser(this.editedUser._id, toBeSaved)
                .then((result)=>{
                    this.user.username = result.username;
                    this.user.email = result.email;
                    this.user.authorizedApps = result.authorizedApps;
                    this.$emit('cancel-user');
                })
                .catch((err)=>{
                    this.statusMessage = "Error saving user: " + err.message;
                    console.log("Error updating user: ", err);
                })
        },
        onCancelButtonClicked: function(){
            this.statusMessage = "";
            this.$emit('cancel-user');
        }
    },
    template: `
    <tr class="user-edit">
        <td colspan=4>
            <div class="form-row">
                <div class="form-group col-md-4">
                    <input type="text" class="form-control" placeholder="Username" v-model="editedUser.username">
                </div>
                <div class="form-group col-md-4">
                    <input type="password" class="form-control" placeholder="Change Password" v-model="editedUser.password">
                </div>
                <div class="form-group col-md-4">
                    <input type="text" class="form-control"  placeholder="Email" v-model="editedUser.email">
                </div>
            </div>
            <div class="form-row">
                <div v-for="(app, index) in availableApps" class="form-check application-list">
                    <input class="form-check-input" type="checkbox" v-bind:value="app.regName" v-model="editedUser.authorizedApps" v-bind:id="'edit-'+app.regName">
                    <label class="form-check-label" v-bind:for="'edit-' + app.regName">{{app.displayName}}</label>
                </div>
            </div>
            <div v-if="statusMessage" class="alert alert-danger" role="alert">{{statusMessage}}</div>
            <div class="text-right">
                <button class="btn btn-primary" v-on:click="onSaveButtonClicked">Save</button>
                <button class="btn btn-secondary" v-on:click="onCancelButtonClicked">Cancel</button>
            </div>
        </td>
    </tr>
`
});