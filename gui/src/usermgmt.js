'use strict';
const ClientLib = require('../lib/clientLib');
const Vue = require('vue/dist/vue');
const myCss = require('./style/usermgmt.scss');
const userViewCmpnt = require('./components/usermgmt/userView');
const userEditCmpnt = require('./components/usermgmt/userEdit');

module.exports = new Vue({
    el: "#app",
    data: function() {
        return {
            users: [],
            selectedUser: {},
            selectedUserId: null,
            newUser: {
                username: "",
                password: "",
                email: "",
                authorizedApps: []
            },
            availableApps: [],
            errorMessage: ""
        }
    },
    mounted: function(){
        this.fetchUsers()
            .then((userList)=>{
                userList.forEach((usr)=>{
                    this.users.push(usr);
                })
                return this.fetchAppInfo()
            })
            .then((appInfo)=>{
                Object.keys(appInfo).forEach((app)=>{
                    this.availableApps.push(appInfo[app]);
                })
            })
    },
    methods: {
        fetchUsers: function(){
            return ClientLib.getUsers()
                .catch((err)=>{
                    console.log("Error retrieving users.", err);
                })
        },
        fetchAppInfo: function(){
            return ClientLib.getApplicationDefinitions()
                .catch((err)=>{
                    console.log("Error getting application definitions.", err);
                })
        },
        createUser: function(){
            this.errorMessage = "";

            let nUser = {
                username: this.newUser.username,
                password: this.newUser.password,
                email: this.newUser.email,
                authorizedApps: this.newUser.authorizedApps
            }
            
            return ClientLib.createUser(nUser)
                .then((result)=>{
                    this.users.push(result);
                })
                .catch((err)=>{
                    this.errorMessage = "Error creating user: " + err.message;
                    console.log("Error creating user: ", err);
                })
        },
        editUser: function(index){
            this.selectedUserId = this.users[index]._id;
        },
        deleteUser: function(index){
            return ClientLib.deleteUser(this.users[index]._id)
                .then(()=>{
                    this.users.splice(index, 1);
                })
                .catch((err)=>{
                    console.log("Error deleting user: ", err);
                })
        },
        cancelUser: function(){
            this.selectedUserId = null;
        },
        onAppsButtonClicked: function(){
            window.location = ClientLib.APPLICATION_URL;
        },
        onLogoutButtonClicked: function(){
            return ClientLib.logout()
                .then(()=>{
                    window.location = ClientLib.AUTHENTICATION_URL;
                })
        }
    },
    template: `
        <div class="container-fluid">
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark justify-content-between">
                <a class="navbar-brand" href="#">User Management</a>
                <div>
                    <ul class="navbar-nav mr-auto">
                        <!-- TODO: Self User Managment -->
                    </ul>
                    <div class="form-inline mt-2 mt-md-0">
                        <button v-on:click="onAppsButtonClicked" class="btn btn-outline-primary mr-sm-2">Back to Apps</button>
                        <button v-on:click="onLogoutButtonClicked" class="btn btn-outline-success my-2 my-sm-0">Logout</button>
                    </div>
                </div>
            </nav>
            <h3 class="main-content">Create New User</h3>
            <div class="form-row">
                <div class="form-group col-md-4">
                    <input type="text" class="form-control" placeholder="Username" v-model="newUser.username">
                </div>
                <div class="form-group col-md-4">
                    <input type="password" class="form-control" placeholder="Password" v-model="newUser.password">
                </div>
                <div class="form-group col-md-4">
                    <input type="text" class="form-control"  placeholder="Email" v-model="newUser.email">
                </div>
            </div>
            <div class="form-row">
                <div v-for="(app, index) in availableApps" class="form-check application-list">
                    <input class="form-check-input" type="checkbox" v-bind:value="app.regName" v-model="newUser.authorizedApps" v-bind:id="app.regName">
                    <label class="form-check-label" v-bind:for="app.regName">{{app.displayName}}</label>
                </div>
            </div>
            <div class="form-group text-right">
                <button class="btn btn-primary" v-on:click="createUser">Create</button>
            </div>
            <div v-if="errorMessage" class="alert alert-danger" role="alert">{{errorMessage}}</div>
            <hr/>
            <h3>Edit Users</h3>
            <div class="user-edit-table">
                <table class="table table-hover table-dark">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Authorized Apps</th>
                            <th width="200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(user, index) in users">
                            <user-view 
                                v-if="user._id != selectedUserId"
                                :key="user._id" 
                                :user="user" 
                                v-on:delete-user="deleteUser(index)"
                                v-on:edit-user="editUser(index)"
                            ></user-view>
                            <user-edit
                                v-if="user._id == selectedUserId"
                                :key="index"
                                :user="user"
                                :appList="availableApps"
                                v-on:cancel-user="cancelUser"
                            ></user-edit>
                        </template> 
                    </tbody>    
                </table>
            </div>
        </div>
    `
})