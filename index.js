var opts = require("nomnom")
    .options({
        cwd: {
            abbr: 'cwd',
            full: 'current-working-directory',
            //if cwd option is provided then change the cwd
            callback: function(cwd) {
                process.chdir(cwd);
            },
            default: process.cwd(),
            help: 'Sets the path to the git repository'
        },
        metadataPackage: {
            abbr: 'mpk',
            full: 'metadata-package',
            default: 'bower.json',
            help: 'Sets the file that will be used for getting the current version'

        },
        version: {
            abbr: 'ver',
            full: 'version',
            help: 'Sets the current version for which the changelog will be generated'
        },
        fileName: {
            abbr: 'f',
            full: 'file-name',
            default: 'CHANGELOG.md',
            help: 'The filename of the generated changelog'
        }
    }).parse();

var changelog = require('conventional-changelog'),
    path = require('path'),
    fs = require('fs');

if (!opts.version) {
    //check if metapackage exists
    try {
        opts.version = require(path.join(opts.cwd, opts.metadataPackage)).version
    } catch (ex) {
        console.error(ex);
        process.exit(1);
    }
}

changelog({
    version: opts.version,
}, function(err, log) {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        fs.writeFile(path.join(opts.cwd, opts.fileName), log);
    }

});