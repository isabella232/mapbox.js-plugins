var fs = require('fs'),
    mime = require('mime'),
    plugins = require('./plugins');

var s3_path = 's3://mapbox-js/mapbox.js/plugins/';
var sh_file = 'deploy.sh';

var sh = [
    '#!/bin/bash',
    'echo "--- DEPLOYING mapbox.js plugins ---"',
    'echo ""',
    'echo ""'
];

for (var plugin in plugins) {
    plugin = plugins[plugin];
    var dir = plugin.prefix + '/';

    for (var version in plugin.v) {
        var cmd;
        plugin.v[version].files.forEach(function(file) {
            cmd = 's3cmd put --acl-public --mime-type ';
            cmd += '"' + mime.lookup(file) + '" ';
            cmd += dir + file + ' ';
            cmd += s3_path + dir + 'v' + version + '/' + file;
            sh.push(cmd);
        });
    }
}

var after = [
    'echo ""',
    'echo ""',
    'echo "--- DEPLOYED mapbox.js plugins ----"',
    ''
];

console.log('updated ' + sh_file);

fs.writeFileSync(sh_file, sh.concat(after).join('\n'));
