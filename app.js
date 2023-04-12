
const express = require('express');
const app = express();
const port = 5000;
const craw = require('./crawler')
const dir = require('./dir')

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/craw', async (req, res) => {
  const data = await craw.init();
  // console.log(data)
})

app.get('/dir', async (req, res) => {
  const data = await dir.init();
  // console.log(data)
})


app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
