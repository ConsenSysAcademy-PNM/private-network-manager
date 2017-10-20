const exec = require('child_process').exec;

class GethNetworkPowController {
  create (req, res) {
    const name = req.body.name
    const num_nodes = req.body.num_nodes
    exec(`./server/scripts/geth/pow/create-network.sh ${name} ${num_nodes}`, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      if (stderr !== null || error !== null) {
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
        res.send(`Error ${stderr} ${error}` )
      } else {
        res.json({message: 'Network Created and Running!', name: name});
      }
    });
  }
  
}

module.exports = GethNetworkPowController;