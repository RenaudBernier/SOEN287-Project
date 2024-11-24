module.exports = function customerLogin(app, db){
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
                res.status(200).json({message: "login success"});

            }
            else{
                res.status(400).json({message: "invalid email or password"});
            }
        })
    });

    app.get("/api/login-check", (req, res) => {
        console.log(req.session.user);

        if(req.session.user) {
            res.json(req.session.user);
        }
        else
            res.json("loggedOut");
    });
    app.get("/api/logout", (req, res) => {
        req.session.destroy((err) => {
            if (err)
                console.log("Couldn't destroy session");
        });
        res.redirect('/test.html');
    });
}