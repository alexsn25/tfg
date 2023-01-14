import web3 from './web3';
import Manuscript from './build/Manuscript.json';

export default (address) => {
    return new web3.eth.Contract(
        Manuscript.abi,
        address
    );
};