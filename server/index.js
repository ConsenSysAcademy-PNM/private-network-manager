const express = require('express');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const GethGenesisPowController = new require('./controllers/geth/GenesisPowController');
const GethNetworkPowController = new require('./controllers/geth/NetworkPowController');
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
app.post('/geth/genesis/new', GethGenesisPowController.create)
// app.post('/geth/genesis/:name/edit', GethGenesisPowController.edit)
// app.get('/geth/genesis/:name/show', GethGenesisPowController.show)
// app.delete('/geth/genesis/:name/destroy', GethGenesisPowController.destroy)
app.post('/geth/network/create', GethNetworkPowController.create)
// app.post('/geth/network/update', GethNetworkPowController.update)
// app.delete('/geth/network/destroy', GethNetworkPowController.destroy)
// app.get('/geth/network/:id/status', GethNetworkPowController.show)

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