const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const webServerConfig = require('../config/web-server.js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');
var os = require('os')
let httpServer;
 
function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);

    // create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(bodyParser.json());
app.use(assignId)
// setup the logger
morganBody(app ,  { stream: accessLogStream , noColors: true});
//app.use(morgan('combined', { stream: accessLogStream }))

 
   // app.use(morgan('combined'));

    app.get('/', (req, res) => {
      res.end('Crash Reporting Service is Running');
    });
    app.post('/', (req, res) => {
        res.json({'message' : 'Crash Report Received Successfully from ' + req.ip});
      });
    httpServer.listen(webServerConfig.port)
      .on('listening', () => {
        console.log(`Crash Reporting Service is Running on ${getIP()}:${webServerConfig.port}  or ${os.hostname()}:${webServerConfig.port}`);
 
        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
}
 
module.exports.initialize = initialize;


// *** previous code above this line ***
 
function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }
 
      resolve();
    });
  });
}

function assignId (req, res, next) {
    req.id = req.ip
    next()
  }
 

  var ifaces = os.networkInterfaces();
function getIP(){
  var ip;
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
     // console.log(ifname + ':' + alias, iface.address);
      ip = iface.address
   // return  iface.address
    } else {
      // this interface has only one ipv4 adress
     // console.log(ifname, iface.address);
      ip = iface.address
      //return  iface.address
    }
    ++alias;
  });
});

return ip;

}
module.exports.close = close;