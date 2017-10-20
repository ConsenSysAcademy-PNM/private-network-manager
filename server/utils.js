var fs = require('fs');

const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

function exec_script() {
  exec('/Users/madhan/Courses/ConsenSys/DubaiHackathon/private-network-manager/test.sh',
    function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
      return stdout;
    });
}


function get_state() {
  var network_states = {};
  try {
    network_states = fs.readFileSync("networks.txt").toString();
  } catch (err) {
    return network_states;
  }

  network_states = JSON.parse(network_states)
  console.log(network_states)

  for (var name in network_states) {
    let state = network_states[name]
    console.log(state)
    status = execSync('./server/scripts/geth/check-network.sh ' + state["networkId"]).toString()
    state["status"] = status.replace(/\r?\n|\r/g, '');
  }
  console.log(network_states)

  return network_states;
}

function save_state(state) {
  var stream = fs.createWriteStream("networks.txt");
  stream.once('open', function (fd) {
    stream.write(JSON.stringify(state));
    stream.end();
  });
}

const createGenesisPromise = ({ name, networkId, consensus, blockTime = 15 }) => new Promise((resolve, reject) => {
  if (consensus === 'pow') blockTime = '';
  exec(`./server/scripts/geth/generate_genesis_${consensus}.sh ${name} ${networkId} ${blockTime}`,
    (error, stdout, stderr) => {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error) {
        console.log('Create genesis error: ' + error);
        reject(`Error creating genesis block: ${name} ${networkId}`);
      } else {
        resolve(`Successfully created genesis block: ${name} ${networkId}`);
      }
    });
})

const createGethNetworkPromise = ({ name, nodeCount, consensus }) => new Promise((resolve, reject) => {
  exec(`./server/scripts/geth/create-network.sh ${name} ${nodeCount} ${consensus}`,
    (error, stdout, stderr) => {
      console.log('create-network.sh stdout: ' + stdout);
      console.log('create-network.sh stderr: ' + stderr);
      if (error) {
        console.log('exec error: ' + error);
        reject(`Error creating geth network: ${name} ${nodeCount}`);
      } else {
        resolve(`Successfully created geth network: ${name} ${nodeCount} ${consensus}`);
      }
    });
})

module.exports = {
  exec_script,
  get_state,
  save_state,
  createGenesisPromise,
  createGethNetworkPromise,
}
