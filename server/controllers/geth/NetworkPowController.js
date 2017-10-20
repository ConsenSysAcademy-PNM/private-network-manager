const exec = require('child_process').exec;

class GethNetworkPowController {
  create (req, res) {
    const network_name = req.body.name
    const num_nodes = req.body.num || 1
    exec(`./server/scripts/geth/pow/create-network.sh ${network_name} ${num_nodes}`, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      if (stderr !== null || error !== null) {
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
        res.send(`Error ${stderr} ${error}` )
      } else {
        res.json({message: 'Network Created and Running!', name: network_name});
      }
    });
  }
  
}

module.exports = GethNetworkPowController;