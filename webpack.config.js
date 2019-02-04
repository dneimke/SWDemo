const path = require('path');

module.exports = (env) => {
    return {
        entry: {
            tool: './Scripts'
        },
        optimization: {

        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        output: {
            filename: 'js/[name].js',
            path: path.resolve(__dirname, 'wwwroot'),
            library: ['lib'],
            libraryTarget: 'umd'
        }
    }
}