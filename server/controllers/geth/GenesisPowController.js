const exec = require('child_process').exec;

class GethGenesisPowController {
  create (req, res) {
    const network_name = req.body.name
    const network_id = req.body.id || ''
    const network_data = req.body.data || ''
    exec(`./server/scripts/geth/pow/generate_genesis_pow.sh ${network_name} ${network_id} ${network_data}`, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      if (stderr !== '' || error !== null) {
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
        res.send(`Error ${stderr} ${error}` )
      } else {
        res.json({message: 'Genesis File created!', name: network_name});
      }
    });
  }

  show (req, res) {
    const network_name = req.params.name
  }

  update (req, res) {
    const network_name = req.params.name
  }

  destroy (req, res) {
    const network_name = req.params.name
  }
}

module.exports = GethGenesisPowController;