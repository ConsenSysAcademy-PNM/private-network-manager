const express = require('express');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const GethGenesisPowController = new (require('./controllers/geth/GenesisPowController'));
const GethNetworkController = new (require('./controllers/geth/NetworkController'));
const exec = require('child_process').exec;
const utils = require('./utils');
const http = require('http')
const Tail = require('tail').Tail;
const WebSocket = require('ws');

const app = express();

/*
 *  EXPRESS CONFIG
 */

app.use(express.static(path.join(__dirname, '../build_webpack')));

// app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// const cors = require('cors');
// app.use(cors());

// TODO: Create routes to run bash scripts
app.post('/geth/genesis/pow/new', GethGenesisPowController.create)
// app.post('/geth/genesis/poa/new', GethGenesisPoaController.create)
// app.post('/geth/genesis/:name/edit', GethGenesisPowController.edit)
// app.get('/geth/genesis/:name/show', GethGenesisPowController.show)
// app.delete('/geth/genesis/:name/destroy', GethGenesisPowController.destroy)
app.post('/geth/network/new', GethNetworkController.create)
app.post('/geth/network/:id/start', GethNetworkController.start)
app.post('/geth/network/stop', GethNetworkController.stop)
app.delete('/geth/network/:id', GethNetworkController.destroy)
// app.get('/geth/network/:id/status', GethNetworkController.show)

app.get('/script', (req, res) => {
  exec('~/Documents/12launch.sh',
    function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
});

app.post('/create_genesis', (req, res) => utils.createGenesisPromise(req.body)
  .then(res => res.status(200).send(res))
  .catch(err => res.status(500).send(err)));

app.post('/create_geth', (req, res) => utils.createGenesisPromise(req.body)
  .then(() => utils.createGethNetworkPromise(req.body))
  .then(result => res.status(200).send(JSON.stringify(result)))
  .catch(err => res.status(500).send(err.toString())));

app.post('/check_network_status', (req, res) => {
  const { networkId } = req.body;
  exec(`./server/scripts/geth/check-network.sh ${networkId}`,
    (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error) {
        console.log('exec error: ' + error);
        res.status(500).send({ networkId, status: stderr });
      } else {
        res.status(200).send({ networkId, status: stdout });
      }
    });
});

app.get('/getExample', (req, res) => {
  res.status(200).send('/getExample response');
});

app.get('/get_state', (req, res) => {
  res.status(200).send(utils.get_state());
});

app.post('/save_state', (req, res) => {
  res.status(200).send(utils.save_state(req.body.networks));
});

app.post('/postExample', (req, res) => {
  console.log(req.body);
  res.status(200).send(`/postExample response: ${JSON.stringify(req.body)}`);
});

app.get('/:bad*', (req, res) => {
  res.status(404).send(`Resource not found '${req.params.bad}'`);
});


app.listen(process.env.PORT || 5000, () => {
  console.warn('Backend server listening on port 5000!');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const tail = new Tail('./screenlog.0');

wss.on('connection', function connection(ws) {
  console.log("Client connected")
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  tail.on("line", function(data) {
    ws.send(data)
  });
    
  tail.on("error", function(error) {
    console.log('ERROR: ', error);
  });
})

server.listen(8080, function listening() {
  console.log('Websocket Listening on %d', server.address().port);
});
