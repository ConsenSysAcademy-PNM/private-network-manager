const Tail = require('tail').Tail;
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port:8080 })

var http    = require('http'),
    fs      = require('fs');

var filename = process.argv[2];
if (!filename) 
{
  console.log("Usage: node <server.js> filename_to_tail");
  return;
}

tail = new Tail(filename);

// -- Node.js Server ----------------------------------------------------------

server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'})
  fs.readFile(__dirname + '/socket.html', function(err, data){
    if (data) {
      res.write(data, 'utf8');
    }
    res.end();
  });
})
server.listen(8000, '0.0.0.0');

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  tail.on("line", function(data) {
    console.log("new data: ", data)
    ws.send(data)
  });
    
  tail.on("error", function(error) {
    console.log('ERROR: ', error);
  });
})


console.log('Server running at http://0.0.0.0:8000/, connect with a browser to see tail output');


