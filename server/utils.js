const exec = require('child_process').exec;

function exec_script(){
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


function get_state(){
    var state = [
        {
          name: 'Network1',
          networkId: 22,
          nodeCount: 5,
          consensus: 'Proof of Work',
          ipAddress: '192.168.121.1',
          status: 'running',
        },
        {
          name: 'Network2',
          networkId: 42,
          nodeCount: 10,
          consensus: 'Proof of Authority',
          ipAddress: '192.168.121.2',
          status: 'stopped',
        },
      ];

    return state;
}



module.exports = {
    exec_script,
    get_state
}
