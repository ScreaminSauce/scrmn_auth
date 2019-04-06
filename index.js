'use strict';
module.exports = {
    name: "auth",
    api: require("./api/api"),
    gui: require("./gui/gui"),
    dbConnections: [
        {
            name: "auth",
            type: "mongo",
            url: "mongodb://localhost:27017",
            dbName: "auth"
        }
    ]
}