const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); //removes everything inside the build folder

const campaignPath = path.resolve(__dirname, 'contracts', 'Manuscript.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

const input = {
    language: "Solidity",
    sources: {
      "Manuscript.sol": {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    "Manuscript.sol"
];

fs.ensureDirSync(buildPath);

console.log(output);

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}