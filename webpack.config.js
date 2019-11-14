const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const isDevelopment = (process.argv.indexOf('--mode=development') !== -1);
const devTool = isDevelopment ? "eval-source-map" : "source-map";
const mode = isDevelopment ? "development" : "production";

module.exports = {
    mode: mode,
    entry: {
        main: ['babel-polyfill', './src/js/main.js']
    },
    output: {
        filename: './js/[name].bundle.js',
        path: path.resolve(__dirname, "dist")
    },
    devtool: devTool,
    devServer: {
        port: 3000,
        open: true,
        contentBase: path.join(__dirname, "./src"),
    },
    cache: false,
    module: {
        rules: [{
                test: /\.js$/,
                //exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.hbs$/,
                loader: "handlebars-loader"
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: isDevelopment,
                            minimize: !isDevelopment
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            autoprefixer: {
                                browsers: ["last 2 versions"]
                            },
                            sourceMap: isDevelopment,
                            plugins: () => [
                                autoprefixer
                            ]
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: isDevelopment
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                        loader: "file-loader",
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.LoaderOptionsPlugin({
            options: {
                handlebarsLoader: {}
            }
        }),
        new MiniCssExtractPlugin({
            filename: "[name]-styles.css",
            chunkFilename: "css/[id].css"
        }),
        new CopyWebpackPlugin([{
            from: 'src/ops/',
            to: 'ops'
        }, ]),
        new CopyWebpackPlugin([{
            from: 'src/images/',
            to: 'images'
        }, ]),
        new CopyWebpackPlugin([{
            from: 'src/files/',
            to: 'files'
        }, ]),
        new HtmlWebpackPlugin({
            // title: 'Citi',
            template: './src/index.hbs',
            filename: 'index.html',
            inject: false,
            localDev: isDevelopment,
            minify: !isDevelopment && {
                html5: true,
                collapseWhitespace: true,
                caseSensitive: true,
                removeComments: false,
                removeEmptyElements: false
            },
        })
    ],
	performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
	}
};

