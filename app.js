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
const customerLogin = require("./customerLoginModule");

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

app.get('/api/services', (req, res) => {
  const query = "SELECT id, name, description, price, image_url, time_slots, model_time_slots FROM Services";
  db.query(query, function (err, result) {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    console.log("result",result);
    res.json(result);

  });
});

app.get('/api/company', (req, res) => {
  const query = "SELECT name, about_us, logo_url, stat1, stat2, stat3, stat1_desc, stat2_desc, stat3_desc FROM Company";
  db.query(query, function(err, result) {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed"})
    }
    console.log(result);
    res.json(result);
  });
});

app.put('/api/services/:id/time-slots', (req, res) => {
  const serviceId = req.params.id;
  const { time_slots } = req.body;

  if (!time_slots) {
    return res.status(400).json({ error: "Missing time_slots in request body" });
  }

  const query = "UPDATE Services SET time_slots = ? WHERE id = ?";
  db.query(query, [time_slots, serviceId], function (err, result) {
    if (err) {
      console.error("Error updating time_slots:", err);
      return res.status(500).json({ error: "Database update failed" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.status(200).json({ message: "Time slots updated successfully" });
  });
});

app.post('/api/book-time-slot', (req, res) => {
  const { client_id, service_id, time_slot, service_fulfilled, message, response } = req.body;


  const data = {
    client_id,
    service_id,
    time_slot,
    service_fulfilled: service_fulfilled || false,
    message: message || "",
    reponse: response || ""
  };

  const query = "INSERT INTO ServiceBooked SET ?";
  db.query(query, data, function (err, result) {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send({ error: "Database error" });
    }
    res.status(200).send({ message: "Data inserted successfully", insertId: result.insertId });
  });
});

app.use(express.static(__dirname));
app.listen(8080, () =>{
    console.log("listening");
})




app.post("/api/register", (req, res) => {
  const customer = req.body;
  db.query("INSERT INTO Customers SET ?", customer, (err, result) =>{
    if (err) {
      res.send("Error: registration failed");
      console.log(customer);
    }
  });
  db.query("SELECT * FROM Customers WHERE email = ?", req.body.email, (err, result) =>{
    if (err)
      res.send("Error: could not log into new account");
    else{
      req.session.user = result[0];
    }
  })
  res.redirect("../test.html");
});

app.post("/api/admin-login", (req, res) =>{
  const password = req.body.password;
  if (password === "password123") {
    req.session.user = "admin";
    res.status(200).json({message: "logged in as admin"});
  }
  else
    res.status(400).json({message: "login unsuccessful"});
});

app.get("/api/admin-login-check", (req, res) => {
  console.log("adminCheck");
  if (req.session.user === "admin"){
    res.json("admin");
  }
  else
    res.json("");
});

// const query = 'REPLACE INTO Company (name, about_us, logo_url, stat1, stat2, stat3) VALUES (?, ?, ?, ?, ?, ?)';
// db.query(query, [data.name, data.about_us, data.logo_url, data.stat1, data.stat2, data.stat3], (err, results) => {
//     if (err) {
//         console.error('Error inserting data:', err.message);
//         return;
//     }
//     console.log('Data inserted successfully:', results);
// });

app.post('/api/company', (req, res) => {
  const query = 'REPLACE INTO Company SET ?';
  const company = req.body;
  console.log("company: ", company);
  // const stats = data.stats.map(stat => `${stat.number} ${stat.description}`);
  //[data.name, data.about_us, data.logo_url, stats[0], stats[1], stats[2]
  db.query(query, company, (err, results) => {
      if (err) {
          console.error('Error inserting data:', err.message);
          return;
      }
      console.log('Data inserted successfully:', results);
  });
  
});


app.post("/api/update-user", (req, res) => {

  const newInfo = req.body;
  console.log(newInfo);
  db.query("UPDATE Customers SET ? WHERE id = ?", [newInfo, newInfo.id], (err, result) =>{
    if (err) {
      res.send("Error updating user");
    }
    req.session.user = newInfo;
    req.session.save((err) => {
      if (err) {
        console.log("Error updating session");
      }
    })
  });
  res.redirect('/test.html');
});



customerLogin(app, db);
adminServicesPage(app, db);
serviceBookedModule(app,db);
servicesModule(app,db);
customersModule(app,db);