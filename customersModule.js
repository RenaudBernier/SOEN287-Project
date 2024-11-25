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

    app.get("/api/my-orders", (req, res) => {
        const userId = req.session.user.id;
        let servicesBooked;
        console.log("THE USER'S ID IS " + userId);

        function queryDB() {
            return new Promise((resolve, reject) => {
                db.query("SELECT sb.*, service.name, service.price FROM ServiceBooked sb " +
                    "JOIN Services service ON sb.service_id = service.id WHERE sb.client_id = ?", [userId], (err, result) => {
                    if (err) {
                        console.log("Error searching services booked");
                        return;
                    }
                    console.log("The result is:", result);
                    resolve(result);
                })
            })
        }

        async function addName() {
            let servicesBooked = await queryDB();

            console.log( "Returned array of services: ", servicesBooked);
            res.json(servicesBooked);
        }
        addName();
    })
}