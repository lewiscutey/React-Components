module.exports = {
    entry: './src/main.jsx',
    output: {
        path: __dirname,
        filename: 'public/js/main.js'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css'},
            {
                test:/\.jsx?$/,
                exclude:/node_modules/,
                loader:'babel',
                query:{presets:['react','es2015']}
            }

        ]
    }
}
