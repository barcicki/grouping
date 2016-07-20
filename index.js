const argv = require('yargs')
    .usage('Usage: $0 [options]')
    .option('input', {
        alias: 'i',
        demand: true,
        type: 'string',
        describe: 'input file'
    })
    .option('output', {
        alias: 'o',
        type: 'string',
        describe: 'output file'
    })
    .option('groupSize', {
        alias: 's',
        type: 'number',
        describe: 'maximum group size'
    })
    .option('strict', {
        type: 'boolean',
        describe: 'force strict mode'
    })
    .help('help')
    .argv;

const yaml = require('js-yaml');
const fs = require('fs');
const grouping = require('./grouping');

const data = yaml.safeLoad(fs.readFileSync(argv.input, 'utf-8'));

if (!grouping.canGroup(data)) {
    throw new Error(`This data is not supported`);
}

const result = grouping.group(data, {
    maxGroupSize: argv.groupSize,
    isStrict: argv.strict
});

console.log('Result:');
console.log(result);

if (argv.output) {
    fs.writeFileSync(argv.output, yaml.safeDump(result), 'utf-8');
    console.log('Saved to file:', argv.output);
}