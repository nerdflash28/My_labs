import * as fs from 'fs';
// upgrade from | const fs = require('fs'); | statement
import * as http from 'http';
import * as url from  'url' ;
import { dirname } from 'path';

// get dirname equivalent in ES6
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// import data from json file 
const data = fs.readFileSync(`${__dirname}/data.json`,'utf-8');
// parse json data from the given variable
const dataObj = JSON.parse(data);



// create server
const server = http.createServer((req,res) => {
    const pathname = req.url;

    if (pathname === '/' || pathname === '/overview') {
        res.end('This is Overview Page');
    } else if ( pathname === '/product' ) {
        res.end('This is Product Page');
    } else if ( pathname === '/api' ) {
        res.writeHead(200, {'Content-Type': 'application/json' });
        res.end(data);
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'hello-world, this page is missing'
        });
        res.end('ERROR 404! : Page not found')
    } 
});

server.listen(8000, '127.0.0.1', () => {
	console.log('Listening to requests on port 8000');
	});

