const exec = require('child_process').exec;

class GethGenesisPowController {
  create (req, res) {
    console.log(req.body)
    const name = req.body.name
    const id = req.body.id
    const data = req.body.data || ''
    exec(`./server/scripts/geth/pow/generate_genesis_pow.sh ${name} ${id} ${data}`, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      if (stderr !== '' || error !== null) {
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
        res.send(`Error ${stderr} ${error}` )
      } else {
        res.json({message: 'Genesis File created!', name: name});
      }
    });
  }

  show (req, res) {
    // const network_name = req.params.name
  }

  update (req, res) {
    // const network_name = req.params.name
  }

  destroy (req, res) {
    // const network_name = req.params.name
  }
}

module.exports = GethGenesisPowController;