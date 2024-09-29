const http = require('http');
const port = 3000;

const requestHandler = (request, response) => {
    response.end('Hello from my Jenkins Declarative Pipeline!');
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }

    console.log(`Server is listening on ${port}`);
});
