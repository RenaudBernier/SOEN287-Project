const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

const adminServices = require('./adminServicesModule');
const adminServicesPage = require('./adminServicesModule');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "database-1.c74ym08uqq3r.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "Fortnite123!",
    database: "schema"
});

db.connect((err) => {
    if (err)
        console.log("Could not connect to database");
});



app.use(express.static(__dirname));
app.listen(8080, () =>{
    console.log("listening");
})

adminServicesPage(app, db);

