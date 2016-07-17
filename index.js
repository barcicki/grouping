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
const requireDir = require('require-dir');
const pairingMethods = requireDir('./pairings');

if (argv.file) {
    try {
        const data = yaml.safeLoad(fs.readFileSync(argv.file, 'utf-8'));
        const pairingMethod = Object.keys(pairingMethods)
            .map(key => pairingMethods[key])
            .sort((methodA, methodB) => methodB.priority - methodA.priority)
            .find(method => method.canPair(data));

        if (!pairingMethod) {
            throw new Error('No pairing method supports this data.');
        }

        console.log(`Using ${pairingMethod.name} method:`);

        const result = pairingMethod.pair(data);

        console.log(result);
    } catch (err) {
        console.log(err);
    }
}