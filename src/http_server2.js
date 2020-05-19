const http = require('http');
const fs = require('fs');

console.log(__dirname);

const server = http.createServer((req, res)=>{
    fs.writeFile(
        __dirname+'/headers.json',  // filename
        JSON.stringify(req.headers),  // content
        error=>{
            if(error){
                console.log(error);
            } else {
                res.end('ok');
            }
        })
});

server.listen(3000);
