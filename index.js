'use strict'

let http = require("http"), fs = require('fs'), qs = require("querystring");
let movie = require("./lib/movie.js");

function serveStatic(res, path, contentType, responseCode){
    if(!responseCode) responseCode = 200;
    fs.readFile(__dirname + path, function(err, data){
        if(err){
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal Server Error');
        }
        else{
            res.writeHead(responseCode, {'Content-Type': contentType});
            res.end(data);
        }
    });
}

http.createServer((req,res) => {
    let url = req.url.split("?");  // seperate route from query string
    let params = qs.parse(url[1]); // convert query string to object
    let path = url[0].toLowerCase();

    switch(path) {
        case '/':
            serveStatic(res, '/../public/home.html', 'text/html');
            break;

        case '/about':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('About');
            break;

        case '/get':
            let found = movie.get(params.title); // get movie object
            res.writeHead(200, {'Content-Type': 'text/plain'});
            let results = (found) ? JSON.stringify(found) : "Not found";
            res.end('searching for ' + params.title + "\n" + results);
            break;

        case '/delete':
            movie.delete(params.title);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(params.title + "\n" + "has been deleted.");
            break;

        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('404:Page not found.');
    }

}).listen(process.env.PORT || 3000);