/**
 * Created by lzh on 2017/3/1.
 */

var process = require('process');

var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    os = require('os');
var port = 3000;

http.createServer(function ( req, res ) {
    var pathName = __dirname + url.parse(req.url).pathname;

    if(pathName == __dirname + '/'){
        pathName += 'index.html';
    }
    var fileType = path.extname(pathName).substring(1, pathName.length-1);
    var fileCode = 'utf-8';
    switch (fileType){
        case 'html':
            res.writeHead(200,{
                'Content-Type': 'text/html'
            });
            break;
        case 'js':
            res.writeHead(200,{
                'Content-Type': 'text/javascript'
            });
            break;
        case 'css':
            res.writeHead(200,{
                'Content-Type': 'text/css'
            });
            break;
        case 'png':
            fileCode = 'binary';
            res.writeHead(200,{
                'Content-Type': 'image/png'
            });
            break;
        case 'jpg':
            fileCode = 'binary';
            res.writeHead(200,{
                'Content-Type': 'image/jpeg'
            });
            break;
        case 'ico':
            fileCode = 'binary';
            break;
        case 'mp3':
            fileCode = 'binary';
            res.writeHead(200,{
                'Content-Type': 'audio/mp3'
            });
            break;
    }
    fs.readFile(pathName,fileCode,function ( err, data ) {
        if(!err){
            if(fileType == 'json'){
                res.end(data);
            } else{
                res.write(data,fileCode);
                res.end();   
            }
        }
    })
}).listen(port);

process.on('exit', function (  ) {
    console.log("bye!");
});

console.log("server is running at 127.0.0.1:"+port);

