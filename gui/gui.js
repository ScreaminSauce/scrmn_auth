'use strict';
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


class GuiBuilder {
    constructor(outputFolder) {
        this._config = {
            entry: {
                'scrmn_auth': path.resolve(__dirname, "src/index.js"),
                'scrmn_auth_app': path.resolve(__dirname, "src/application.js")
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
                }]),
                new MiniCssExtractPlugin()
            ]
        }
    }

    getAppInfo(){
        return {
            urlSuffix: "/auth/applications",
            icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M439.3 76H72.7C50.3 76 32 94 32 116v240c0 22 18.3 40 40.7 40h101.8v40h162.9v-40h101.8c22.4 0 40.5-18 40.5-40l.2-240c.1-22-18.2-40-40.6-40zm0 280H72.7V116h366.5v240z"/></svg>',
            displayName: "App 1"
        }
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