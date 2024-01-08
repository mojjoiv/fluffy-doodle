const bodyParser = require('body-parser');
const express = require('express');
const Blockchain = require('./blockchain');
// const PubSub = require('./pubsub');
const PubSub = require('./pubsubredis');

const app = express();
const blockchain = new Blockchain();
const pubSub= new PubSub({blockchain});
// const PubSub = new PubSub({blockchain});

setTimeout(() => pubSub.broadcastChain(), 1000);

app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
   res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const {data} = req.body;

  blockchain.addBlock({ data });

  res.redirect('/api/blocks');
});

const PORT = 4000;
app.listen(PORT, () => console.log(`listening at localhost:${PORT}`));