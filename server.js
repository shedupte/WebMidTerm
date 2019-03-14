var express = require('express');
const { Pool, Client } = require('pg')
var app = express();

const PORT = process.env.PORT || 3000;

const client = new Client({
  user: 'xgdveevvrfaffr',
  host: 'ec2-23-23-173-30.compute-1.amazonaws.com',
  database: 'd94984dv6smnsi',
  password: '1fa80ac8efc7eea93461dba717fa152bb14ac04168348e6f3e891eecd486462b',
  port: 5432,
  ssl: true
});

const pool = new Pool({
  user: 'xgdveevvrfaffr',
  host: 'ec2-23-23-173-30.compute-1.amazonaws.com',
  database: 'd94984dv6smnsi',
  password: '1fa80ac8efc7eea93461dba717fa152bb14ac04168348e6f3e891eecd486462b',
  port: 5432,
  ssl: true
})

app.get('/', function (req, res, next) {
  client.connect((err) => {
    if (err)
      throw err;
    else {
      client.query('SELECT * FROM Employee WHERE empid = $1', [1], (err, result) => {
        if (err) {
          res.status(400).send(err)
        } else {
          res.status(200).send(result.rows)
        }
      })
    }
  })
});

app.get('/sp', (req, res, next) => {
  client.connect((err) => {
    if (err)
      throw err;
    else {
      client.query('SELECT * from GetAllEmployee()', (err, result) => {
        if (err) {
          throw err
          res.status(400).send(err)
        } else {
          res.status(200).send(result.rows);
        }
      })
    }
  })
})

app.get('/pool', (req, res, next) => {
  pool.connect((err, client, release) => {
    if (err) {
      console.log(`not able to get connection ${err}`)
      res.status(400).send(err)
    }
    client.query('SELECT * from GetAllEmployee()', (err, result) => {
      release()
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      res.status(200).send(result.rows);
    })
  })
})

app.listen(PORT, function () {
  console.log('Server is running.. on Port 3000');
});