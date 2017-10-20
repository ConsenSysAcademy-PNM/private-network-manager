const exec = require('child_process').exec;

class GethNetworkController {
  create(req, res) {
    const { name, nodeCount, consensus } = req.body;
    exec(`./server/scripts/geth/create-network.sh ${name} ${nodeCount} ${consensus}`, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      if (stderr !== '' || error !== null) {
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
        res.send(`Error ${stderr} ${error}`)
      } else {
        res.json({ message: 'Network Created and Running!', name: name });
      }
    });
  }

  start (req, res) {
    const { consensus, name, networkId, nodeCount } = req.body;
    exec(`./server/scripts/geth/start-network.sh ${name} ${networkId} ${nodeCount} ${consensus}`, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      if (error) {
        // TODO: Error showing in output even though node is running
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
        res.status(500).send(`Error ${stderr} ${error}`);
      } else {
        res.json({ message: `Network ${name} Started!` });
      }
    });
  }

  stop (req, res) {
    exec("./server/scripts/geth/stop-network.sh", (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      stdout.split('\n').forEach(pid => {
        try {
          process.kill(parseInt(pid, 10), 'SIGINT')
        }
        catch (e) {
          // console.log(e)
        }
      })

      if (stderr !== '' || error !== null) {
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
        res.send(`Error ${stderr} ${error}`)
      } else {
        res.json({ message: 'Networks Stopped!' });
      }
    });
  }

  destroy(req, res) {
    const id = req.params.id
    exec(`./server/scripts/geth/destroy-network.sh ${id}`, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      stdout.split('\n').forEach(pid => {
        try {
          process.kill(parseInt(pid, 10), 'SIGINT')
        }
        catch (e) {
          // console.log(e)
        }
      })
      if (stderr !== '' || error !== null) {
        console.log('stderr: ' + stderr);
        console.log('exec error: ' + error);
        res.send(`Error ${stderr} ${error}`)
      } else {
        res.json({ message: `Network ${id} Destroyed!` });
      }
    });
  }

}

module.exports = GethNetworkController;