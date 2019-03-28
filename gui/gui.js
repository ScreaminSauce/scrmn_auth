'use strict';
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


class GuiBuilder {
    constructor(outputFolder) {
        this._config = {
            entry: {
                'auth_login': path.resolve(__dirname, "src/index.js"),
                'auth_apps': path.resolve(__dirname, "src/application.js")
            },
            output: {
                filename: '[name].js',
                path: path.resolve(outputFolder),
                sourceMapFilename: '[name].map'
            },
            devtool: "source-map",
            node: {
                fs: 'empty',
                net: 'empty',
                tls: 'empty',
                dns: 'empty',
                global: true
            },
            module: {
                rules: [{
                    test: /\.s[c|a]ss$/,
                    use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                }]
            },
            plugins: [
                new CopyWebpackPlugin([{
                    from: path.resolve(__dirname, 'static/index.html'),
                    to: outputFolder + '/index.html'
                },{
                    from: path.resolve(__dirname, 'static/application.html'),
                    to: outputFolder + '/application.html'
                },{
                    from: path.resolve(__dirname, 'static/images/domo.jpg'),
                    to: outputFolder + '/images/domo.jpg'
                }]),
                new MiniCssExtractPlugin()
            ]
        }
    }

    getAppInfo(){
        return [
            {
                urlPath: "/public/auth/usermgmt.html",
                icon: '/public/auth/images/domo.jpg',
                regName: "auth-user-management",
                displayName: "User Management",
                description: "Managing users of the ScreaminSauce Apps"
            }
        ]
    }

    build(logger) {
        return new Promise((resolve, reject) => {
            webpack([this._config], (err, stats) => {
                if (err || stats.hasErrors()) {
                    let info = stats.toJson();
                    info.errors.forEach((sError) => {
                        logger.error(JSON.stringify(sError, null, 2));
                    })
                    logger.error(err);
                    reject(err);
                } else {
                    logger.info("Webpack build complete for module.")
                    resolve();
                }
            });
        })
    }
}

module.exports = GuiBuilder;