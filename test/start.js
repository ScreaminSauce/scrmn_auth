const ScreaminServer = require('@screaminsauce/screaminserver');
const AuthModule = require("../")

let server = new ScreaminServer({
    name: 'authTest',
    type: 'both',
    options: {
        port: 3000,
        host: 'localhost'
    },
    modules: [AuthModule],
    wwwDir: 'public',
    auth: {
        secret: 'ThisIsATestSecretThisIsATestSecretThisIsATestSecret',
        cookieName: "screaminCookie",
        redirectTo: false,
        isSecure: false
    }
});

process.on('unhandledRejection', (err)=>{
    console.log(err);
    process.exit(1);
})

server.startup();;