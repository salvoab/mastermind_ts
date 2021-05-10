const path = require('path');
const {readFileSync} = require('fs');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {NodeConfigTSPlugin} = require('node-config-ts/webpack');

const {yamlParse} = require('yaml-cfn');

const conf = {
    prodMode: process.env.NODE_ENV === 'production',
    templatePath: './serverless.yaml',
};
const cfn = yamlParse(readFileSync(conf.templatePath));

const entries = Object.values(cfn.functions)
    .filter(v => v.name === 'AWSServerlessDashboard')
    .map(v => ({
        // Isolate handler src filename
        handlerFile: v.handler.split('.')[0],
        // Build handler dst path
        CodeUriDir: ""
    }))
    .reduce(
        (entries, v) =>
            Object.assign(
                entries,
                {[`${v.CodeUriDir}/${v.handlerFile}`]: `./${v.handlerFile.replace('dist', 'src')}.ts`}
            ),
        {}
    );
console.log(JSON.stringify(entries));
console.log(`Building for ${conf.prodMode ? 'production' : 'development'}...`);

module.exports = NodeConfigTSPlugin({
    // http://codys.club/blog/2015/07/04/webpack-create-multiple-bundles-with-entry-points/#sec-3
    entry: entries,
    target: 'node',
    mode: conf.prodMode ? 'production' : 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        path: path.resolve(__dirname, ''),
        filename: "[name].js",
        libraryTarget: 'commonjs2',
    },
    devtool: 'source-map',
    plugins: conf.prodMode ? [
        new UglifyJsPlugin({
            parallel: true,
            extractComments: true,
            sourceMap: true,
        }),
    ] : [],
});
