module.exports = function adminServicesPage(app, db) {
    app.get('/api/servicebooked', (req, res) => {
        const query = "SELECT * FROM ServiceBooked";
        db.query(query, function (err, result) {
          if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Database query failed" });
          }
      
          res.json(result);
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
      
      app.put('/api/update-response', (req, res) => {
        const { order_id, reponse } = req.body;
      
        if (!order_id || reponse === undefined) {
          return res.status(400).send({ error: "Missing order_id or response"});
        }
      
        const query = "UPDATE ServiceBooked SET reponse = ? WHERE order_id = ?";
        db.query(query, [reponse, order_id], function (err, result) {
          if (err) {
            console.error("Error updating data:", err);
            return res.status(500).send({ error: "Database error" });
          }
      
          if (result.affectedRows === 0) {
            return res.status(404).send({ error: "No row found with the specified order_id" });
          }
      
          res.status(200).send({ message: "Response updated successfully" });
        });
      });
      
      app.put('/api/update-status', (req, res) => {
        const { order_id, service_fulfilled } = req.body;
      
        if (!order_id || service_fulfilled === undefined) {
          return res.status(400).send({ error: "Missing order_id or service_fulfilled"});
        }
      
        const query = "UPDATE ServiceBooked SET service_fulfilled = ? WHERE order_id = ?";
        db.query(query, [service_fulfilled, order_id], function (err, result) {
          if (err) {
            console.error("Error updating data:", err);
            return res.status(500).send({ error: "Database error" });
          }
      
          if (result.affectedRows === 0) {
            return res.status(404).send({ error: "No row found with the specified order_id" });
          }
      
          res.status(200).send({ message: "Response updated successfully" });
        });
      });
      
      app.put('/api/update-message', (req, res) => {
        const { order_id, message } = req.body;
      
        if (!order_id || message === undefined) {
          return res.status(400).send({ error: "Missing order_id or message"});
        }
      
        const query = "UPDATE ServiceBooked SET message = ? WHERE order_id = ?";
        db.query(query, [message, order_id], function (err, result) {
          if (err) {
            console.error("Error updating data:", err);
            return res.status(500).send({ error: "Database error" });
          }
      
          if (result.affectedRows === 0) {
            return res.status(404).send({ error: "No row found with the specified order_id" });
          }
      
          res.status(200).send({ message: "Response updated successfully" });
        });
      });
}