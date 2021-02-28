const fs = require('fs-extra');
const UglifyJS = require('uglify-es');

async function minify(filePath) {
    let file = await fs.readFile(filePath, 'utf8');
    let nameCache = {};

    let result = UglifyJS.minify(file, {
        mangle: {
            properties: {
                regex: /^_spab_/
            }
        },
        compress: false,
        toplevel: true,
        nameCache: nameCache
    });

    console.log(result);


    result.code = result.code.replace(/"_spab_(.*?)"/g, (str) => {

        try {
            let propName = '"' + nameCache.props.props['$' + str.substring(1, str.length-1)] + '"';

            console.log(str + ': ' + propName);
    
            if (propName) {
                return propName;
            }
        } catch (e) {}

        return str;
    });

    await fs.writeFile(filePath, result.code);
}

async function build() {
    let filesInDir = await fs.readdir('./dist');

    for (let filePath of filesInDir) {
        if (filePath.startsWith('main.') && filePath.endsWith('.js')) {
            minify('./dist/' + filePath);
        }
    }
}

build();