const exec = require('child_process').exec;

class GethNetworkController {
  create (req, res) {
    const name = req.body.name
    const num_nodes = req.body.num_nodes
    const type = req.body.type
    exec(`./server/scripts/geth/create-network.sh ${name} ${num_nodes} ${type}`, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      if (stderr !== '' || error !== null) {
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
        res.send(`Error ${stderr} ${error}` )
      } else {
        res.json({message: 'Network Created and Running!', name: name});
      }
    });
  }

  start (req, res) {
    const name = req.body.name
    const id = req.params.id
    const num_nodes = req.body.num_nodes
    const type = req.body.type
    exec(`./server/scripts/geth/start-network.sh ${name} ${id} ${num_nodes} ${type}`, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      if (stderr || error) {
        // TODO: Error showing in output even though node is running
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
        res.send(`Error ${stderr} ${error}` )
      } else {
        res.json({message: `Network ${name} Started!`});
      }
    });
  }

  stop (req, res) {
    exec("./server/scripts/geth/stop-network.sh", (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      stdout.split('\n').forEach( pid => {
        try {
          process.kill(parseInt(pid,10), 'SIGINT')
        }
        catch(e) {
          // console.log(e)
        }
      })

      if (stderr !== '' || error !== null) {
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
        res.send(`Error ${stderr} ${error}` )
      } else {
        res.json({message: 'Networks Stopped!'});
      }
    });
  }

  destroy (req, res) {
    const id = req.params.id
    exec(`./server/scripts/geth/destroy-network.sh ${id}`, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      stdout.split('\n').forEach( pid => {
        try {
          process.kill(parseInt(pid,10), 'SIGINT')
        }
        catch(e) {
          // console.log(e)
        }
      })
      if (stderr !== '' || error !== null) {
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
        res.send(`Error ${stderr} ${error}` )
      } else {
        res.json({message: `Network ${id} Destroyed!`});
      }
    });
  }
  
}

module.exports = GethNetworkController;