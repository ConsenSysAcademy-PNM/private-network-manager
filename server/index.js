const express = require('express');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const exec = require('child_process').exec;
const utils = require('./utils');

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

app.post('/create_genesis', (req, res) => {
  const { name, networkId, consensus } = req.body;
  exec(`./server/scripts/generate_genesis_${consensus}.sh ${name} ${networkId}`,
    (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error) {
        console.log('exec error: ' + error);
        res.status(500).send(`Error creating genesis block: ${name} ${networkId}`);
      } else {
        res.status(200).send(`Successfully created genesis block: ${name} ${networkId}`);
      }
    });
});

app.post('/create_geth_pow', (req, res) => {
  const { name, networkId } = req.body;
  const consensus = 'pow';
  exec(`./server/scripts/geth-create-network.sh ${name} ${networkId} ${consensus}`,
    (error, stdout, stderr) => {
      console.log('geth-create-network.sh stdout: ' + stdout);
      console.log('geth-create-network.sh stderr: ' + stderr);
      if (error) {
        console.log('exec error: ' + error);
        res.status(500).send(`Error creating geth network: ${name} ${networkId}`);
      } else {
        res.status(200).send(`Successfully created geth network: ${name} ${networkId} ${consensus}`);
      }
    });
});

app.post('/check_network_status', (req, res) => {
  const { networkId } = req.body;
  exec(`./server/scripts/check-network.sh ${networkId}`,
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

app.get('/save_state', (req, res) => {
  res.status(200).send(utils.save_state());
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