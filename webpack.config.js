const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '3d-model-loader.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env', '@babel/react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: '[name].[ext]',
                    outputPath: 'images/',
                    publicPath: 'images/',
                },
            },
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 3000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
        }),
    ],
};
