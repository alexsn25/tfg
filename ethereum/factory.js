import web3 from './web3';
import ManuscriptFactory from './build/ManuscriptFactory.json';

const instance = new web3.eth.Contract(
    ManuscriptFactory.abi,
    '0xA09a11541e36BDB0ba8922730B3D42D62856A6ed'
);

export default instance;