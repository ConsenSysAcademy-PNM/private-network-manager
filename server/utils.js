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

  var network_states = fs.readFileSync("networks.txt");
  network_states = JSON.parse(network_states)
  console.log(network_states)
  console.log(execSync(`pwd`))
  for (let i = 0; i < network_states.length; i++) {
    let state = network_states[i]
    console.log(state)
    status = execSync('./server/scripts/check-network.sh ' + state["networkId"]).toString()
    state["status"] = status
  }
  console.log(network_states)
  return network_states;
}

function save_state() {
  var stream = fs.createWriteStream("networks.txt");
  stream.once('open', function (fd) {
    stream.write(JSON.stringify(get_state()));
    stream.end();
  });
}

const createGenesisPromise = ({ name, networkId, consensus }) => new Promise((resolve, reject) => {
  exec(`./server/scripts/generate_genesis_${consensus}.sh ${name} ${networkId}`,
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

const createGethNetworkPromise = ({ name, networkId, consensus }) => new Promise((resolve, reject) => {
  exec(`./server/scripts/geth-create-network.sh ${name} ${networkId} ${consensus}`,
    (error, stdout, stderr) => {
      console.log('geth-create-network.sh stdout: ' + stdout);
      console.log('geth-create-network.sh stderr: ' + stderr);
      if (error) {
        console.log('exec error: ' + error);
        reject(`Error creating geth network: ${name} ${networkId}`);
      } else {
        resolve(`Successfully created geth network: ${name} ${networkId} ${consensus}`);
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
