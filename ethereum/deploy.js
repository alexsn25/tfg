const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/ManuscriptFactory.json');

const provider = new HDWalletProvider(
  'athlete gravity private spy load uniform crazy vehicle prepare neutral blouse recipe',
  'https://goerli.infura.io/v3/cd4aea9761914d9b9ce24467a2ae4cf1'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: '2500000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
