var webpack = require("webpack");
var path = require('path');
var nodeModules = {
    "umzug": "commonjs umzug",
    "umzug-dynamodb-storage": "commonjs umzug-dynamodb-storage"
};

module.exports = {  
    devtool: undefined,
    entry: path.join(process.cwd(), 'src', process.env.ENTRY || 'index'),
    plugins: [
        new webpack.DefinePlugin({ "global.GENTLY": false })
    ].filter(function(i) { return i != null; }),
    target: 'node',
    module: {
        loaders: [
            {
                test: /.*\.ts$/,
                exclude: /node_modules/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    externals: nodeModules,
    output: {
        libraryTarget: 'commonjs',
        path: path.join(process.cwd(), 'build/dist'),
        filename: 'index.js'
    }
};
