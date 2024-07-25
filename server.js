const express = require('express');
const bodyParser = require('body-parser');
const { ec: EC } = require('elliptic');
const ec = new EC('secp256k1');

// Initialize server
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Generate an elliptic key pair
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log(`Public Key: ${publicKey}`);
console.log(`Private Key: ${privateKey}`);

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route to sign the message
app.post('/sign', (req, res) => {
  const message = req.body.message;
  const msgHash = ec.hash().update(message).digest();
  const signature = key.sign(msgHash);

  const derSign = signature.toDER('hex');
  res.send({ signature: derSign });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
