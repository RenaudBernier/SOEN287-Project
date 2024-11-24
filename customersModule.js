module.exports = function servicesModule(app, db) {
app.get('/api/customers', (req, res) => {
    const query = "SELECT * FROM Customers";
      db.query(query, function (err, result) {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Database query failed" })
        }
        res.json(result);
      });
    });   
}