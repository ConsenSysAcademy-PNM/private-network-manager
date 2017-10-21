const Web3 = require('web3');
const web3Admin = require('web3admin');

web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
web3Admin.extend(web3);

class GethMiningController {

  start (req, res) {
  	web3.miner.start(1);
	res.json({ isMining: web3.eth.mining });
  }

  stop (req, res) {
  	web3.miner.stop();
	res.json({ isMining: web3.eth.mining });
  }

}

module.exports = GethMiningController;
