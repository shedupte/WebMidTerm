/*********************************************************************************
*  WEB322 – Assignment02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: ___Tenzin Shedup__ Student ID: __120664180____ Date: ___03/08/19______
*
*  Online (Heroku) Link: _____https://quiet-mesa-75926.herokuapp.com/_______
*
********************************************************************************/

const express = require('express');
const { Client, Pool } = require('pg');
const Sequelize = require('sequelize');
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const PORT = process.env.PORT || 3000;

const app = express();

// instruct the app to use the "bodyparser" middleware
app.use(bodyParser.urlencoded({ extended: true }));

// instruct the app to use express handlebars for the view engine with the .hbs extension
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

const config = {
    user: 'xgdveevvrfaffr',
    host: 'ec2-23-23-173-30.compute-1.amazonaws.com',
    database: 'd94984dv6smnsi',
    password: '1fa80ac8efc7eea93461dba717fa152bb14ac04168348e6f3e891eecd486462b',
    port: 5432,
    max: 10, // max number of connection can be open to database
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    ssl: true
};

// const sequelize = new Sequelize(config.database, config.user, config.password, {
//     host: config.host,
//     dialect: 'postgres',
//     port: 5432,
//     dialectOptions: {
//         ssl: true
//     }
// });

// var Project = sequelize.define('Project', {
//     title: Sequelize.STRING,
//     description: Sequelize.TEXT
// });

// sequelize.sync().then(() => {

//     // create a new "Project" and add it to the database
//     Project.create({
//         title: 'Project1',
//         description: 'First Project'
//     }).then((project) => {
//         // you can now access the newly created Project via the variable project
//         console.log("success!")
//     }).catch((err) => {
//         console.log("something went wrong!");
//     });
// });

var pool = new Pool(config);

app.get('/', (req, res, next) => {
    let client = new Client(config);
    client.connect((err) => {
        if (err) {
            console.log("not able to get connection " + err);
            //  res.status(400).send(err);
        }
        else {
            client.query('SELECT * FROM Employee WHERE empid= $1',
                [1], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    else {
                        var data = result.rows;
                        res.render("main", { data: data })
                        client.end();
                    }
                });
        }
    })
});

app.get('/sp', (req, res, next) => {
    let client = new Client(config);
    client.connect((err) => {
        if (err) {
            console.log("not able to get connection " + err);
            res.status(400).send(err);
        }
        else {
            client.query('SELECT * from GetAllEmployee()', (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(400).send(err)
                }
                else {
                    var data = result.rows;
                    res.render("main", { data: data })
                    client.end()
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
        // let client = new Client(config);
        client.query('SELECT * from GetAllEmployee()', (err, result) => {
            release()
            if (err) {
                console.log(err);
                res.status(400).send(err);
            } else {
                var data = result.rows;
                res.render("main", { data: data })
                client.end()
            }
        })
    })
})

app.listen(PORT, () => {
    console.log(`Server is running.. on Port ${PORT}`);
});