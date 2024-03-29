'use strict';
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

class GuiBuilder {
    constructor(outputFolder) {
        this._config = {
            entry: {
                'auth_login': path.resolve(__dirname, "src/login.js"),
                'auth_apps': path.resolve(__dirname, "src/application.js"),
                'auth_usermgmt': path.resolve(__dirname, "src/usermgmt.js")
            },
            output: {
                filename: '[name].js',
                path: path.resolve(outputFolder),
                sourceMapFilename: '[file].map[query]'
            },
            devtool: "source-map",
            module: {
                rules: [{
                    test: /\.s[c|a]ss$/,
                    use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                }]
            },
            plugins: [
                new CleanWebpackPlugin(),
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: path.resolve(__dirname + '/static' ) + '/**',
                            context: path.resolve(__dirname + '/static')
                        }
                    ]
                }),
                new MiniCssExtractPlugin()
            ]
        }
    }

    getAppInfo(){
        return [
            {
                urlPath: "/public/auth/usermgmt.html",
                icon: '/public/auth/images/batdomo.jpg',
                regName: "auth-user-management",
                displayName: "User Management",
                description: "Managing users of the ScreaminSauce Apps"
            }
        ]
    }

    build(logger) {
        return new Promise((resolve, reject) => {
            webpack([this._config], (err, stats) => {
                if (stats && stats.hasErrors()){
                    let info = stats.toJson();
                    info.errors.forEach((sError) => {
                        logger.error(JSON.stringify(sError, null, 2));
                    })
                    logger.error(err);
                }
                if (err) {
                    logger.error(err);
                    reject(err);
                } else {
                    logger.info({module: "manualtest"}, "Webpack build complete for module.")
                    resolve();
                }
            });
        })
    }
}

module.exports = {
    name: "auth",
    type: "gui",
    gui: GuiBuilder
};