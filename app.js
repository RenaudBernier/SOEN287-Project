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

app.get('/api/services', (req, res) => {
  const query = "SELECT id, name, description, price, image_url, time_slots, model_time_slots FROM Services";
  db.query(query, function (err, result) {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

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

adminServicesPage(app, db);
