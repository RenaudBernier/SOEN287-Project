
module.exports = function adminServicesPage(app, db) {

    app.get('/api/services', (req, res) => {
        let query = db.query('SELECT * FROM Services', (err, result) => {
            if (err)
                console.log("Could not retrieve Services")
            else
                res.send(result);
        })
    });

    app.post('/api/change-services', async (req, res) => {
        const services = req.body;
        let array_ids = services.map(service => service.id);

        async function getIds() {
            return new Promise((res, rej) => {
                let db_ids;
                let query = db.query('SELECT id FROM Services', function (err, result) {
                    if (err) {
                        console.log("Error while retrieving ID's");
                        return rej(err);
                    } else {
                        console.log(result);
                        db_ids = result.map(service => service.id);
                        console.log(db_ids);
                    }
                    res(db_ids);
                })
            })
        }

        let db_ids;
        try {
            db_ids = await getIds();
        } catch (error) {
            console.log("ERROR");
        }

        for (let i = 0; i < services.length; i++) {
            console.log(db_ids);
            //Updates existing row
            if (db_ids.some(id => id == services[i].id)) {
                let query = db.query(`UPDATE Services SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?`,
                    [
                        services[i].name,
                        services[i].description,
                        services[i].price,
                        services[i].image_url,
                        services[i].id
                    ],
                    (err, result) => {
                        if (err)
                            console.log("unlucky");
                    });
            }
            //Adds new row
            else {
                let query = db.query(`INSERT INTO Services SET ?`, services[i], (err) => {
                    if (err)
                        console.log("Could not create new entry in Services")
                })
            }
        }
        for (let i = 0; i < db_ids.length; i++) {
            console.log("Array IDS" + array_ids);
            if (!(array_ids.some(id => id == db_ids[i]))) {
                let query = db.query(`DELETE FROM Services WHERE id = ?`, db_ids[i], (err) => {
                    if (err)
                        console.log("Error when trying to delete a row in Services");
                    else
                        console.log("Deleted a row in Services");
                })
            }
        }

    });
}