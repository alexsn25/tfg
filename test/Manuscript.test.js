const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/ManuscriptFactory.json');
const compiledManuscript = require('../ethereum/build/Manuscript.json');

let accounts;
let factory;
let ManuscriptAddress;
let manuscript;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '2500000'});

    await factory.methods.submitManuscript(accounts[1], "QsjdKaSk87sHSd8hNcD",
     "Implementation of a bridge between Polygon and Ethereum",
     "App that connects Polygon and Ethereum", ["blockchain", "crypto", "ethereum"], 5).send({
        from: accounts[0],
        gas: '2500000'
    });

    /*
    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];
    */

    [manuscriptAddress] = await factory.methods.getManuscripts().call();
    manuscript = await new web3.eth.Contract(compiledManuscript.abi,
    manuscriptAddress
    );
});

describe('Manuscripts', () => {
    it('deploys a factory and a manuscript', () => {
        assert.ok(factory.options.address);
        assert.ok(manuscript.options.address);
    });

    it('submits a new manuscript', async () => {

        await factory.methods.submitManuscript(accounts[1], "QsjdKaSk90sHSd8hNkL",
         "Why gold and bitcoin could outperform in a recessionary environment",
         "Study of the advantages of bitcoin over gold",
         ["economics", "gold", "bitcoin"], 4
         ).send({
            from: accounts[0],
            gas: '2500000'
        });

        const manuscripts = await factory.methods.getManuscripts().call({
            from: accounts[0]
        });

        assert.equal(2, manuscripts.length);
    });

    it('marks the account which submits the manuscript as its author', async () => {
        const author = await manuscript.methods.author().call();
        assert.equal(author, accounts[0]);
    });

    it('editor is assigned', async () => {
        const editor = await manuscript.methods.editor().call();
        assert.equal(editor, accounts[1]);
    });

    it('a reviewer is assigned', async () => {

        await manuscript.methods.assignReviewer(accounts[2]).send({
            from: accounts[1],
            gas: '1000000'
        });

        const isReviewer = await manuscript.methods.reviewers(accounts[2]).call();

        assert.ok(isReviewer);
    });

    it('someone who is not the editor cannot assign a new reviewer', async () => {
        try {
            await manuscript.methods.assignReviewer(accounts[2]).send({
                from: accounts[3],
                gas: '1000000'
            })
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('a reviewer submits a review', async () => {

        await manuscript.methods.assignReviewer(accounts[2]).send({
            from: accounts[1],
            gas: '1000000'
        });

        await manuscript.methods.submitReview("QxsdKaSk87sHSd8hNnV").send({
            from: accounts[2],
            gas: '1000000'
        });

        const review = await manuscript.methods.reviews(0).call();

        assert.equal(review.doccid, "QxsdKaSk87sHSd8hNnV");
    });

    it('someone who is not a reviewer cannot submit a review', async () => {
        try {
            await manuscript.methods.submitReview("QxsdKaSk87sHSd8hNnV").send({
                from: accounts[2],
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('tries to submit a Manuscript with a Field of Research out of bounds (index greater than 7)', async () => {
        try {
            await factory.methods.submitManuscript(accounts[1], "QsjdKaSk90sHSd8hNkL",
            "Why gold and bitcoin could outperform in a recessionary environment",
            "Study of the advantages of bitcoin over gold",
            ["economics", "gold", "bitcoin"], 9
            ).send({
               from: accounts[0],
               gas: '2500000'
           });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    /*
    it('testing assert', async () => {

        try { 
            assert(false);
        } catch(err) {
            assert(true);
        } 
        
    });
    */

});


