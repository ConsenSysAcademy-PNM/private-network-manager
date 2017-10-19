var fs = require('fs');

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
      return fs.readFileSync("networks.txt");
}

function save_state(){
    var stream = fs.createWriteStream("networks.txt");
    stream.once('open', function(fd) {
    stream.write(JSON.stringify(get_state()));
    stream.end();
    });
}


module.exports = {
    exec_script,
    get_state, 
    save_state
}
