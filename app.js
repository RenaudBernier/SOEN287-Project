const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const session = require('express-session');

const adminServices = require('./adminServicesModule');
const adminServicesPage = require('./adminServicesModule');
const serviceBookedModule = require('./serviceBookedModule');
const servicesModule = require('./servicesModule');
const customersModule = require('./customersModule');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({secret: "NFYVN72K*W#$If.fP"}));

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

app.post("/api/login", (req, res) => {
  const credentials = req.body;
  console.log(credentials);

  db.query("SELECT * FROM Customers", (err, result) => {
    const customersArr = result;
    let userInfo = null;
    for(const entry of customersArr){
      if (credentials.email === entry.email && credentials.password === entry.password) {
        userInfo = entry;
        break;
      }
    }

    if (userInfo !== null){
      console.log(userInfo);
      req.session.user = userInfo;
      res.redirect(req.get('referer'));
    }

  })
});



app.get("/api/login-check", (req, res) => {
  console.log(req.session.user);
  res.json(req.session.user);
});
app.get("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err)
      console.log("Couldn't destroy session");
  });
  res.redirect('/test.html');
});

adminServicesPage(app, db);
serviceBookedModule(app,db);
servicesModule(app,db);
customersModule(app,db);