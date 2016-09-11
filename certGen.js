const pem = require('pem');
const fs = require('fs');

pem.createCertificate({days:1, selfSigned:true}, function(err, keys){
  fs.writeFile("cert.pem", keys.certificate);
  fs.writeFile("key.pem", keys.serviceKey);
});
