const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/ManuscriptFactory.json');
const Manuscript = require('./build/Manuscript.json');

const provider = new HDWalletProvider(
    'athlete gravity private spy load uniform crazy vehicle prepare neutral blouse recipe',
    'https://goerli.infura.io/v3/cd4aea9761914d9b9ce24467a2ae4cf1'
);
const web3 = new Web3(provider);

const factory = new web3.eth.Contract(
    compiledFactory.abi,
    '0xA09a11541e36BDB0ba8922730B3D42D62856A6ed'
);

const initialize = async () => {
    
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to initialize from', accounts[0]);

    await factory.methods.submitManuscript(accounts[4], "QmULLDtu869FEXpEGevL4cK6eC52JmLfpC9RdF6dhK9gku",
        "Implementation of a bridge between Polygon and Ethereum",
        "App that connects Polygon and Ethereum", ["blockchain", "crypto", "ethereum", "polygon"], 5).send({
            from: accounts[0]
        });

    await factory.methods.submitManuscript(accounts[3], "QmULLDtu869FEXpEGevL4cK6eC52JmLfpC9RdF6dhK9gku",
        "Why gold and bitcoin could outperform corporate bonds in a recessionary environment",
        "Study of the advantages of bitcoin over gold", ["economics", "gold", "bitcoin"], 4).send({
            from: accounts[1]
        });

    await factory.methods.submitManuscript(accounts[6], "QmULLDtu869FEXpEGevL4cK6eC52JmLfpC9RdF6dhK9gku",
        "How the process of RNA Sequencing is going to change over the next 10 years",
        "The implications of technological advances in RNA Sequencing and how it will reduce costs", 
        ["rna", "genomics", "biotech"], 6).send({
            from: accounts[6]
        });

    console.log('Manuscripts submitted');

    const manuscriptAddresses = await factory.methods.getManuscripts().call();

    const manuscript0 = new web3.eth.Contract(Manuscript.abi, manuscriptAddresses[0]);
    const manuscript1 = new web3.eth.Contract(Manuscript.abi, manuscriptAddresses[1]);
    const manuscript2 = new web3.eth.Contract(Manuscript.abi, manuscriptAddresses[2]);

    await manuscript0.methods.assignReviewer(accounts[5]).send({
        from: accounts[4]
    });

    await manuscript0.methods.assignReviewer(accounts[6]).send({
        from: accounts[4]
    });

    console.log('Reviewers assigned');

    await manuscript0.methods.submitReview("QmX287tEXHcYMs23ND3FnhXc6QBHFjW2Lwekrz23Lpju6R").send({
        from: accounts[5]
    });

    await manuscript0.methods.submitReview("QmX7XtvfD6yjhL6Z9vVgaD9jZwRQodqubye8miRVcMCc4f").send({
        from: accounts[6]
    });

    console.log('Reviews submitted');

    provider.engine.stop();
};
initialize();