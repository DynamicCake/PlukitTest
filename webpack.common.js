const path = require('path')

module.exports = {
    mode: "production",
    context: __dirname,
    node: {
        __filename: true
    },
    entry: path.resolve(__dirname, 'src/index.ts'),
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".js", ".ts"]
    },
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: 'panel.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['ts-loader']
            },
        ],
    },
}
