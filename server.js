const http = require('http');
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const app = require('./app');

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});