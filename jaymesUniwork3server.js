const http = require('http');
const fs = require('fs');
const path = require('path');

// Define the path to your HTML file
const filePath = path.join(__dirname, 'path/to/jaymesUniwork3html.html');

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Read the HTML file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        // Serve the HTML file
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

// Define the port to listen on (e.g., 3000)
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});