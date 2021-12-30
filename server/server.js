const http = require('http');
const port = process.env.PORT || 9090;

const server = http.createServer();
server.listen(port);
console.log(`Listening on port: ${port}`)
