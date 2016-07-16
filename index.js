const argv = require('yargs')
    .usage('Usage: $0 [options]')
    .option('file', {
        alias: 'f',
        demand: true,
        type: 'string',
        describe: 'input file'
    })
    .help('help')
    .argv;

const yaml = require('js-yaml');
const fs = require('fs');
const pair = require('./lib/pair');

if (argv.file) {
    try {
        const data = yaml.safeLoad(fs.readFileSync(argv.file, 'utf-8'));
        const result = pair(data);

        console.log(result);
    } catch (err) {
        console.log(err);
    }
}