
module.exports = function servicesModule(app, db) {
    app.get('/api/services', (req, res) => {
        const query = "SELECT * FROM Services";
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
      
}